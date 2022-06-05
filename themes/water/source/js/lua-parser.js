/**
 * @typedef {import('./lua-lexer').Lexer} Lexer
 * @typedef {import('./lua-lexer').Token} Token
 * @typedef {import('./lua-lexer').Location} Location
 * @typedef {import('./lua-lexer').TokenType}
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
    return new Block();
  }

  /** parse Exp */
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
    console.log(
      this.lexer.lookAhead(),
      this.lexer.lookAhead(),
      TOKEN_SEP_COMMA
    );

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
    while (true) {
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
    switch (this.lexer.lookAhead) {
      case TOKEN_SEP_LPAREN: // ( [epxList] )
        this.lexer.nextToken();
        if (this.lexer.lookAhead() !== TOKEN_SEP_RPAREN) {
          args = this.prefixExpList();
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
