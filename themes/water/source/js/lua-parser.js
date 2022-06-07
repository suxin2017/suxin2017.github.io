/**
 * @typedef {import('./lua-lexer').Lexer} Lexer
 * @typedef {import('./lua-lexer').Token} Token
 * @typedef {import('./lua-lexer').Location} Location
 * @typedef {import(./lua-token)}
 */

class Parser {
  /**
   *
   * @param {Lexer} lexer
   */
  constructor(lexer) {
    this.lexer = lexer;
  }

  parse() {
    return this.parseBlock();
  }

  // block ::= { stat } [retStat]
  parseBlock() {
    return new Block(this.parseStates(), this.parseRetExps(), null);
  }

  parseStates() {
    let stats = [];
    while (!this.isReturnOrBlockEnd(this.lexer.lookAhead())) {
      let stat = this.parseState();
      if (!(stat instanceof EmptyStat)) {
        stats.push(stat);
      }
    }
    return stats;
  }
  parseRetExps() {
    if (this.lexer.lookAhead() !== TOKEN_KW_RETURN) {
      return null;
    }
    this.lexer.nextToken();
    switch (this.lexer.lookAhead()) {
      case TOKEN_EOF:
      case TOKEN_KW_END:
      case TOKEN_KW_ELSE:
      case TOKEN_KW_ELSEIF:
      case TOKEN_KW_UNTIL:
        return [];
      case TOKEN_SEP_SEMI:
        this.lexer.nextToken();
        return [];
      default:
        let exps = this.parseExpList();
        if (this.lexer.lookAhead() === TOKEN_KW_SEMI) {
          this.lexer.nextToken();
        }
        return exps;
    }
  }

  isReturnOrBlockEnd(token) {
    if (
      token === TOKEN_KW_RETURN ||
      token === TOKEN_EOF ||
      token === TOKEN_KW_END ||
      token === TOKEN_KW_ELSE ||
      token === TOKEN_KW_ELSEIF ||
      token === TOKEN_KW_UNTIL
    ) {
      return true;
    }
    return false;
  }
  /**
   * Statement
   */
  parseState() {
    console.log(this.lexer.lookAhead());
    switch (this.lexer.lookAhead()) {
      case TOKEN_SEP_SEMI:
        return this.parseEmptyStat();
      case TOKEN_KW_BREAK:
        return this.parseBreakStat();
      case TOKEN_SEP_LABEL:
        return this.parseLabelStat();
      case TOKEN_KW_GOTO:
        return this.parseGotoStat();
      case TOKEN_KW_DO:
        return this.parseDoStat();
      case TOKEN_KW_WHILE:
        return this.parseWhileStat();
      case TOKEN_KW_REPEAT:
        return this.parseRepeatStat();
      case TOKEN_KW_IF:
        return this.parseIfStat();
      case TOKEN_KW_FOR:
        return this.parseForStat();
      case TOKEN_KW_FUNCTION:
        return this.parseFuncDefStat();
      case TOKEN_KW_LOCAL:
        return this.parseLocalAssignOrFuncDefStat();
      default:
        return this.parseAssignOrFuncCallStat();
    }
  }

  parseEmptyStat() {
    this.lexer.nextTokenOfKind(TOKEN_SEP_SEMI);
    return new EmptyStat();
  }
  parseBreakStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_BREAK);
    return new BreakStat();
  }
  parseLabelStat() {
    this.lexer.nextTokenOfKind(TOKEN_SEP_LABEL);
    let [name, _, location] = this.lexer.nextTokenOfKind(TOKEN_IDENTIFIER);
    this.lexer.nextTokenOfKind(TOKEN_SEP_LABEL);
    return new LabelStat(name);
  }
  parseGotoStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_GOTO);
    let [name, _, location] = this.lexer.nextTokenOfKind(TOKEN_IDENTIFIER);
    return new GotoStat(name);
  }
  parseWhileStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_WHILE);
    let exp = this.parseExp();
    this.lexer.nextTokenOfKind(TOKEN_KW_DO);
    let block = this.parseBlock();
    this.lexer.nextTokenOfKind(TOKEN_KW_END);
    return new WhileStat(exp, block);
  }
  parseRepeatStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_REPEAT);
    let block = this.parseBlock();
    this.lexer.nextTokenOfKind(TOKEN_KW_UNTIL);
    let exp = this.parseExp();
    return new RepeatStat(block, exp);
  }
  parseIfStat() {
    let exps = [];
    let blocks = [];
    this.lexer.nextTokenOfKind(TOKEN_KW_IF);

    exps.push(this.parseExp());
    this.lexer.nextTokenOfKind(TOKEN_KW_THEN);
    blocks.push(this.parseBlock());

    while (this.lexer.lookAhead() === TOKEN_KW_ELSEIF) {
      this.lexer.nextTokenOfKind(TOKEN_KW_ELSEIF);
      exps.push(this.parseExp());
      this.lexer.nextTokenOfKind(TOKEN_KW_THEN);
      blocks.push(this.parseBlock());
    }

    if (this.lexer.lookAhead() === TOKEN_KW_ELSE) {
      this.lexer.nextToken();
      exps.push(new TrueExp(this.lexer.line));
      blocks.push(this.parseBlock());
    }

    this.lexer.nextTokenOfKind(TOKEN_KW_END);
    return new IfStat(exps, blocks);
  }

  parseForStat() {
    let [, , location] = this.lexer.nextTokenOfKind(TOKEN_KW_FOR);
    let [, name] = this.lexer.nextIdentifier();
    if (this.lexer.lookAhead() === TOKEN_OP_ASSIGN) {
      return this.finishForNumStat(name, location);
    } else {
      return this.finishForInStat(name, location);
    }
  }
  finishForNumStat(name, location) {
    let [, , _] = this.lexer.nextTokenOfKind(TOKEN_OP_ASSIGN);
    let initExp = this.parseExp();
    this.lexer.nextTokenOfKind(TOKEN_SEP_COMMA);
    let limitExp = this.parseExp();
    let stepExp = null;
    if (this.lexer.lookAhead() === TOKEN_SEP_COMMA) {
      this.lexer.nextToken();
      stepExp = this.parseExp();
    } else {
      stepExp = new IntegerExp(1);
    }

    let [, , doLocation] = this.lexer.nextTokenOfKind(TOKEN_KW_DO);
    let block = this.parseBlock();
    this.lexer.nextTokenOfKind(TOKEN_KW_END);

    return new ForNumStat({
      locationOfDo: doLocation,
      locationOfFor: location,
      varName: name,
      initExp,
      limitExp,
      stepExp,
      block,
    });
  }
  finishForInStat(name) {
    let names = this.finishNameList(name);
    this.lexer.nextTokenOfKind(TOKEN_KW_IN);
    let expsList = this.parseExpList();
    let [, , locationOfDo] = this.lexer.nextTokenOfKind(TOKEN_KW_DO);
    let block = this.parseBlock();
    this.lexer.nextTokenOfKind(TOKEN_KW_END);
    return new ForInStat({
      locationOfDo,
      nameList: names,
      expsList,
      block,
    });
  }
  finishNameList(name0) {
    let names = [name0];
    while (this.lexer.lookAhead() === TOKEN_SEP_COMMA) {
      this.lexer.nextToken();
      let [, name] = this.lexer.nextIdentifier();
      names.push(name);
    }
    return names;
  }

  parseLocalAssignOrFuncDefStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_LOCAL);
    if (this.lexer.lookAhead() === TOKEN_KW_FUNCTION) {
      return this.finishLocalFuncDeclStat();
    } else {
      return this.finishLocalVarDeclStat();
    }
  }

  finishLocalFuncDeclStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_FUNCTION);
    let [, name, location] = this.lexer.nextIdentifier();
    let fdExp = this.parseFuncDefExp();
    return new LocalFuncDeclStat(name, fdExp);
  }

  finishLocalVarDeclStat() {
    let [, name0] = this.lexer.nextIdentifier();
    let names = this.finishNameList(name0);
    let expList = null;
    if (this.lexer.lookAhead() === TOKEN_OP_ASSIGN) {
      this.lexer.nextToken();
      expList = this.parseExpList();
    }
    return new LocalVarDeclStat(null, names, expList);
  }

  // a.b()
  // a.b = 123
  parseAssignOrFuncCallStat() {
    let prefixExp = this.parsePrefixExp();
    if (prefixExp instanceof FuncCallExp) {
      return prefixExp;
    } else {
      return this.parseAssignStat(prefixExp);
    }
  }

  //assignStat ::= Name {, Name}
  parseAssignStat(var0) {
    let varList = this.finishVarList(var0);
    this.lexer.nextTokenOfKind(TOKEN_OP_ASSIGN);
    let expList = this.parseExpList();
    return new AssignStat(null, varList, expList);
  }
  finishVarList(var0) {
    let vars = [var0];
    while (this.lexer.lookAhead() === TOKEN_SEP_COMMA) {
      this.lexer.nextToken();
      let exp = this.parsePrefixExp();
      vars.push(this.checkVar(exp));
    }
    return vars;
  }
  checkVar(exp) {
    if (exp instanceof NameExp || exp instanceof TableAccessExp) {
      return exp;
    }
    this.lexer.nextTokenOfKind(-1);
    throw new Error("unreachable");
  }

  parseFuncDefStat() {
    this.lexer.nextTokenOfKind(TOKEN_KW_FUNCTION);
    let { fnExp, hasColon } = this.parseFuncName();
    let fdExp = this.parseFuncDefExp();
    if (hasColon) {
      fdExp.parList.unshift("self");
    }
    return new AssignStat(null, [fnExp], [fdExp]);
  }
  parseFuncName() {
    let [, name, location] = this.lexer.nextIdentifier();
    let exp = new NameExp(name, location);
    while (this.lexer.lookAhead() === TOKEN_SEP_DOT) {
      this.lexer.nextToken();
      let [, name, location] = this.lexer.nextIdentifier();
      let idx = new StringExp(location, name);
      exp = new TableAccessExp(exp, name, idx);
    }
    if (this.lexer.lookAhead() === TOKEN_SEP_COLON) {
      this.lexer.nextToken();
      let [, name, location] = this.lexer.nextIdentifier();
      let idx = new StringExp(location, name);
      exp = new TableAccessExp(exp, name, idx);
      hasColon = true;
    }
    return exp;
  }

  /**
   * parse Exp
   */
  parseExpList() {
    let exps = [this.parseExp()];
    while (this.lexer.lookAhead() === TOKEN_SEP_COMMA) {
      this.lexer.nextToken();
      exps.push(this.parseExp());
    }
    return exps;
  }
  parseExp() {
    return this.parseExp12();
  }

  parseExp12() {
    let exp = this.parseExp11();
    while (this.lexer.lookAhead() === TOKEN_OP_OR) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp11());
    }
    return exp;
  }

  parseExp11() {
    let exp = this.parseExp10();
    while (this.lexer.lookAhead() === TOKEN_OP_AND) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp10());
    }
    return exp;
  }
  parseExp10() {
    let exp = this.parseExp9();
    while (
      this.lexer.lookAhead() === TOKEN_OP_EQ ||
      this.lexer.lookAhead() === TOKEN_OP_NE ||
      this.lexer.lookAhead() === TOKEN_OP_LT ||
      this.lexer.lookAhead() === TOKEN_OP_LE ||
      this.lexer.lookAhead() === TOKEN_OP_GT ||
      this.lexer.lookAhead() === TOKEN_OP_GE
    ) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp9());
    }
    return exp;
  }
  parseExp9() {
    let exp = this.parseExp8();
    while (this.lexer.lookAhead() === TOKEN_OP_BOR) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp8());
    }
    return exp;
  }
  parseExp8() {
    let exp = this.parseExp7();
    while (this.lexer.lookAhead() === TOKEN_OP_BXOR) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp7());
    }
    return exp;
  }
  parseExp7() {
    let exp = this.parseExp6();
    while (this.lexer.lookAhead() === TOKEN_OP_BAND) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp6());
    }
    return exp;
  }
  parseExp6() {
    let exp = this.parseExp5();
    while (this.lexer.lookAhead() === TOKEN_OP_CONCAT) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new UnaryOpExp(location, op, exp);
    }
    return exp;
  }
  parseExp5() {
    let exp = this.parseExp4();
    if (this.lexer.lookAhead() !== TOKEN_OP_CONCAT) {
      return exp;
    }
    let location = null;
    let exps = [exp];
    while (this.lexer.lookAhead() === TOKEN_OP_CONCAT) {
      location = this.lexer.nextToken()[2];
      exps.push(this.parseExp4());
    }
    return new ConcatExp(location, exps);
  }
  parseExp4() {
    let exp = this.parseExp3();
    while (
      this.lexer.lookAhead() === TOKEN_OP_ADD ||
      this.lexer.lookAhead() === TOKEN_OP_SUB
    ) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp3());
    }
    return exp;
  }
  parseExp3() {
    let exp = this.parseExp2();
    while (
      this.lexer.lookAhead() === TOKEN_OP_MUL ||
      this.lexer.lookAhead() === TOKEN_OP_DIV ||
      this.lexer.lookAhead() === TOKEN_OP_MOD ||
      this.lexer.lookAhead() === TOKEN_OP_IDIV
    ) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp2());
    }
    return exp;
  }
  parseExp2() {
    if (
      this.lexer.lookAhead() === TOKEN_OP_NOT ||
      this.lexer.lookAhead() === TOKEN_OP_UNM ||
      this.lexer.lookAhead() === TOKEN_OP_BNOT ||
      this.lexer.lookAhead() === TOKEN_OP_LEN
    ) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new UnOpExp(location, op, this.parseExp2());
    }
    return this.parseExp1();
  }

  parseExp1() {
    let exp = this.parseExp0();
    if (this.lexer.lookAhead() === TOKEN_OP_POW) {
      let [op, _, location] = this.lexer.nextToken();
      exp = new BinOpExp(location, op, exp, this.parseExp2());
    }
    return exp;
  }
  parseExp0() {
    let location, token;
    console.log(this.lexer.lookAhead());
    switch (this.lexer.lookAhead()) {
      case TOKEN_VARARG:
        [, , location] = this.lexer.nextToken();
        return new VarArgExp(location);
      case TOKEN_KW_NIL:
        [, , location] = this.lexer.nextToken();
        return new NilExp(location);
      case TOKEN_KW_TRUE:
        [, , location] = this.lexer.nextToken();
        return new TrueExp(location);
      case TOKEN_KW_FALSE:
        [, , location] = this.lexer.nextToken();
        return new FalseExp(location);
      case TOKEN_NUMBER:
        return this.parseNumberExp();
      case TOKEN_STRING:
        [, token, location] = this.lexer.nextToken();
        return new StringExp(location, token);
      case TOKEN_SEP_LCURLY:
        return this.parseTableConstructorExp();
      case TOKEN_KW_FUNCTION:
        return this.parseFuncDefExp();
      case TOKEN_EOF:
        return null;
      default:
        return this.parsePrefixExp();
    }
  }
  parseTableConstructorExp() {
    let [, , location] = this.lexer.nextTokenOfKind(TOKEN_SEP_LCURLY); // {
    let { keyExps, valExps } = this.parseFieldList();
    console.log(keyExps, valExps);
    let [, , lastLocation] = this.lexer.nextTokenOfKind(TOKEN_SEP_RCURLY); // }
    return new TableConstructorExp(location, lastLocation, keyExps, valExps);
  }
  parseFieldList() {
    let keyExps = [],
      valExps = [];
    if (this.lexer.lookAhead() !== TOKEN_SEP_RCURLY) {
      let { k, v } = this.parseField();
      keyExps.push(k);
      valExps.push(v);
      while (this.isFieldSep(this.lexer.lookAhead())) {
        this.lexer.nextToken();
        if (this.lexer.lookAhead() !== TOKEN_SEP_RCURLY) {
          let { k, v } = this.parseField();
          keyExps.push(k);
          valExps.push(v);
        } else {
          break;
        }
      }
    }
    return { keyExps, valExps };
  }
  isFieldSep(tokenKind) {
    return tokenKind === TOKEN_SEP_COMMA || tokenKind === TOKEN_SEP_SEMI;
  }
  parseField() {
    if (this.lexer.lookAhead() === TOKEN_SEP_LBARCK) {
      //[
      this.lexer.nextToken();
      let k = this.parseExp();
      this.lexer.nextTokenOfKind(TOKEN_SEP_RBRACK); // ]
      this.lexer.nextTokenOfKind(TOKEN_OP_ASSIGN); // =
      let v = this.parseExp();
      return { k, v };
    }

    let exp = this.parseExp();

    if (exp instanceof NameExp) {
      if (this.lexer.lookAhead() === TOKEN_OP_ASSIGN) {
        this.lexer.nextToken();
        let k = new StringExp(exp.location, exp.name);
        let v = this.parseExp();
        return { k: exp, v };
      }
      return { k: exp, v: new NilExp(exp.location) };
    }
    return { k: null, v: exp };
  }
  parseFuncDefExp() {
    let location;
    if (this.lexer.lookAhead() === TOKEN_KW_FUNCTION) {
      [, , location] = this.lexer.nextToken();
    }

    this.lexer.nextTokenOfKind(TOKEN_SEP_LPAREN);
    let { parList, isVarArg } = this.parseParList();
    this.lexer.nextTokenOfKind(TOKEN_SEP_RPAREN);
    let block = this.parseBlock();
    let [, , lastLocation] = this.lexer.nextTokenOfKind(TOKEN_KW_END);
    return new FuncDefExp(location, lastLocation, parList, isVarArg, block);
  }
  parseParList() {
    switch (this.lexer.lookAhead()) {
      case TOKEN_SEP_RPAREN:
        return { parList: null, isVarArg: false };
      case TOKEN_VARARG:
        this.lexer.nextToken();
        return { parList: null, isVarArg: true };
    }
    let isVarArg = false;
    let parList = [];
    let [, par] = this.lexer.nextIdentifier();
    parList.push(par);
    while (this.lexer.lookAhead() === TOKEN_SEP_COMMA) {
      this.lexer.nextToken();
      if (this.lexer.lookAhead() === TOKEN_VARARG) {
        this.lexer.nextToken();
        isVarArg = true;
        break;
      } else {
        [, par] = this.lexer.nextIdentifier();

        parList.push(par);
      }
    }

    return { parList, isVarArg };
  }
  parseNumberExp() {
    let [, token, location] = this.lexer.nextToken();
    let num = Number(token);
    if (Number.isInteger(num)) {
      return new IntegerExp(location, num);
    } else {
      return new FloatExp(location, num);
    }
  }

  /**
   * prefixExp
   */
  parsePrefixExp() {
    let exp;
    if (this.lexer.lookAhead() === TOKEN_IDENTIFIER) {
      let [, name, location] = this.lexer.nextToken();
      exp = new NameExp(location, name);
    } else {
      exp = this.parseParensExp();
    }
    return this.finishPrefixExp(exp);
  }

  parseParensExp() {
    this.lexer.nextTokenOfKind(TOKEN_SEP_LPAREN);
    let exp = this.parseExp();
    this.lexer.nextTokenOfKind(TOKEN_SEP_RPAREN);

    if (
      exp instanceof VarArgExp ||
      exp instanceof FuncCallExp ||
      exp instanceof NameExp ||
      exp instanceof TableAccessExp
    ) {
      return new ParensExp(exp);
    }
    return exp;
  }

  finishPrefixExp(exp) {
    let location;
    let line = this.lexer.line;
    while (true) {
      if (line !== this.lexer.nextLine) {
        return exp;
      }     
      switch (this.lexer.lookAhead()) {
        case TOKEN_SEP_LBARCK: {
          this.lexer.nextToken();
          let keyExp = this.parseExp();
          [, , location] = this.lexer.nextTokenOfKind(TOKEN_SEP_RBRACK);
          exp = new TableAccessExp(location, exp, keyExp);
          break;
        }
        case TOKEN_SEP_DOT: {
          this.lexer.nextToken();
          let [, name, location] = this.lexer.nextIdentifier();
          let keyExp = new StringExp(location, name);
          exp = new TableAccessExp(location, exp, keyExp);
          break;
        }
        // function call
        case TOKEN_SEP_LPAREN:
        case TOKEN_SEP_LCURLY:
        case TOKEN_STRING:
        case TOKEN_SEP_COLON: {
          exp = this.finishFuncCall(exp);
          break;
        }
        default:
          return exp;
      }
    }
  }

  finishFuncCall(prefixExp) {
    // FIXME: location bug
    let nameExp = this.parseNameExp();
    let args = this.parseArgs();
    return new FuncCallExp(null, null, prefixExp, nameExp, args);
  }
  parseNameExp() {
    if (this.lexer.lookAhead() === TOKEN_SEP_COLON) {
      this.lexer.nextToken();
      let [, name, location] = this.lexer.nextIdentifier();
      return new StringExp(location, name);
    }
    return null;
  }
  parseArgs() {
    let args;
    switch (this.lexer.lookAhead()) {
      case TOKEN_SEP_LPAREN: // ( [epxList] )
        this.lexer.nextToken();
        if (this.lexer.lookAhead() !== TOKEN_SEP_RPAREN) {
          args = this.parseExpList();
        }
        this.lexer.nextTokenOfKind(TOKEN_SEP_RPAREN);
        break;
      case TOKEN_SEP_LCURLY: // { [fieldList] }
        args = [this.parseTableConstructorExp()];
        break;
      default: // LiteralString
        let [, str, location] = this.lexer.nextTokenOfKind(TOKEN_STRING);
        args = [new StringExp(location, str)];
    }
    return args;
  }
}

window.mixin = function (target, source) {
  Object.assign(target.prototype, {
    a() {
      console.log("a");
    },
  });
  console.log(target.prototype);
};
mixin(Parser);
