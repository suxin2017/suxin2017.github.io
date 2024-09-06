const TOKEN_EOF = "end-of-file";
const TOKEN_VARARG = "...";
const TOKEN_SEP_SEMI = ";";
const TOKEN_SEP_COMMA = ",";
const TOKEN_SEP_DOT = ".";
const TOKEN_SEP_COLON = ":";
const TOKEN_SEP_LABEL = "::";
const TOKEN_SEP_LPAREN = "(";
const TOKEN_SEP_RPAREN = ")";
const TOKEN_SEP_LBARCK = "[";
const TOKEN_SEP_RBRACK = "]";
const TOKEN_SEP_LCURLY = "{";
const TOKEN_SEP_RCURLY = "}";
const TOKEN_OP_ASSIGN = "=";
const TOKEN_OP_MINUS = "- (sub or unm)";
const TOKEN_OP_WAVE = "~ (bnot or bxor)";
const TOKEN_OP_ADD = "+";
const TOKEN_OP_MUL = "*";
const TOKEN_OP_DIV = "/";
const TOKEN_OP_IDIV = ":";
const TOKEN_OP_POW = "^";
const TOKEN_OP_MOD = "%";
const TOKEN_OP_BAND = "&";
const TOKEN_OP_BOR = "|";
const TOKEN_OP_SHR = ">>";
const TOKEN_OP_SHL = "<<";
const TOKEN_OP_CONCAT = "..";
const TOKEN_OP_LT = "<";
const TOKEN_OP_LE = "<=";
const TOKEN_OP_GT = ">";
const TOKEN_OP_GE = ">=";
const TOKEN_OP_EQ = "==";
const TOKEN_OP_NE = "~=";
const TOKEN_OP_LEN = "#";
const TOKEN_OP_AND = "and";
const TOKEN_OP_OR = "or";
const TOKEN_OP_NOT = "not";
const TOKEN_KW_BREAK = "break";
const TOKEN_KW_DO = "do";
const TOKEN_KW_ELSE = "else";
const TOKEN_KW_ELSEIF = "elseif";
const TOKEN_KW_END = "end";
const TOKEN_KW_FALSE = "false";
const TOKEN_KW_FOR = "for";
const TOKEN_KW_FUNCTION = "function";
const TOKEN_KW_GOTO = "goto";
const TOKEN_KW_IF = "if";
const TOKEN_KW_IN = "in";
const TOKEN_KW_LOCAL = "local";
const TOKEN_KW_NIL = "nil";
const TOKEN_KW_REPEAT = "repeat";
const TOKEN_KW_RETURN = "return";
const TOKEN_KW_THEN = "then";
const TOKEN_KW_TRUE = "true";
const TOKEN_KW_UNTIL = "until";
const TOKEN_KW_WHILE = "while";
const TOKEN_IDENTIFIER = "identifier";
const TOKEN_NUMBER = "number literal";
const TOKEN_STRING = "string literal";
const TOKEN_OP_UNM = "-"; // TOKEN_OP_MINUS
const TOKEN_OP_SUB = "-"; //TOKEN_OP_MINUS
const TOKEN_OP_BNOT = "~"; //TOKEN_OP_WAVE
const TOKEN_OP_BXOR = "~"; //TOKEN_OP_WAVE
function kindToCategory(kind) {
  const other = [
    TOKEN_EOF,
    TOKEN_VARARG,
    TOKEN_SEP_SEMI,
    TOKEN_OP_UNM,
    TOKEN_OP_SUB,
    TOKEN_OP_BNOT,
    TOKEN_OP_BXOR,
  ];
  const separator = [
    TOKEN_SEP_SEMI,
    TOKEN_SEP_COMMA,
    TOKEN_SEP_DOT,
    TOKEN_SEP_COLON,
    TOKEN_SEP_LABEL,
    TOKEN_SEP_LPAREN,
    TOKEN_SEP_RPAREN,
    TOKEN_SEP_LBARCK,
    TOKEN_SEP_RBRACK,
    TOKEN_SEP_LCURLY,
    TOKEN_SEP_RCURLY,
  ];
  const operator = [
    TOKEN_OP_ASSIGN,
    TOKEN_OP_MINUS,
    TOKEN_OP_WAVE,
    TOKEN_OP_ADD,
    TOKEN_OP_MUL,
    TOKEN_OP_DIV,
    TOKEN_OP_IDIV,
    TOKEN_OP_POW,
    TOKEN_OP_MOD,
    TOKEN_OP_BAND,
    TOKEN_OP_BOR,
    TOKEN_OP_SHR,
    TOKEN_OP_SHL,
    TOKEN_OP_CONCAT,
    TOKEN_OP_LT,
    TOKEN_OP_LE,
    TOKEN_OP_GT,
    TOKEN_OP_GE,
    TOKEN_OP_EQ,
    TOKEN_OP_NE,
    TOKEN_OP_LEN,
    TOKEN_OP_AND,
    TOKEN_OP_OR,
    TOKEN_OP_NOT,
  ];
  const keyword = [
    TOKEN_KW_BREAK,
    TOKEN_KW_DO,
    TOKEN_KW_ELSE,
    TOKEN_KW_ELSEIF,
    TOKEN_KW_END,
    TOKEN_KW_FALSE,
    TOKEN_KW_FOR,
    TOKEN_KW_FUNCTION,
    TOKEN_KW_GOTO,
    TOKEN_KW_IF,
    TOKEN_KW_IN,
    TOKEN_KW_LOCAL,
    TOKEN_KW_NIL,
    TOKEN_KW_REPEAT,
    TOKEN_KW_RETURN,
    TOKEN_KW_THEN,
    TOKEN_KW_TRUE,
    TOKEN_KW_UNTIL,
    TOKEN_KW_WHILE,
  ];
  const identifier = [TOKEN_IDENTIFIER];
  const number = [TOKEN_NUMBER];
  const string = [TOKEN_STRING];
  if (other.includes(kind)) {
    return "other";
  } else if (separator.includes(kind)) {
    return "separator";
  } else if (operator.includes(kind)) {
    return "operator";
  } else if (keyword.includes(kind)) {
    return "keyword";
  } else if (identifier.includes(kind)) {
    return "identifier";
  } else if (number.includes(kind)) {
    return "number";
  } else if (string.includes(kind)) {
    return "string";
  } else {
    return "other";
  }
}
const keywords = {
  and: TOKEN_OP_ADD,
  break: TOKEN_KW_BREAK,
  do: TOKEN_KW_DO,
  else: TOKEN_KW_ELSE,
  elseif: TOKEN_KW_ELSEIF,
  end: TOKEN_KW_END,
  false: TOKEN_KW_FALSE,
  for: TOKEN_KW_FOR,
  function: TOKEN_KW_FUNCTION,
  goto: TOKEN_KW_GOTO,
  if: TOKEN_KW_IF,
  in: TOKEN_KW_IN,
  local: TOKEN_KW_LOCAL,
  nil: TOKEN_KW_NIL,
  not: TOKEN_OP_NOT,
  or: TOKEN_OP_OR,
  repeat: TOKEN_KW_REPEAT,
  return: TOKEN_KW_RETURN,
  then: TOKEN_KW_THEN,
  true: TOKEN_KW_TRUE,
  until: TOKEN_KW_UNTIL,
  while: TOKEN_KW_WHILE,
};

const reNewLine = /\r\n|\n\r|\n|\r/;
const reIdentifier = /^[_\d\w]+/; //标识符字母数字下划线开头

// 转义字符
const reDecEscapeSeq = /^\\[0-9]{1,3}/; // ascii 转义
const reHexEscapeSeq = /^\\x[0-9a-fA-F]{2}/; // 16进制转移
const reUnicodeEscapeSeq = /^\\u\{[0-9-a-f-A-F]+\}/; // unicode 转义

// https://regexper.com/#%2F%5E0%5BxX%5D%5B0-9a-fA-F%5D*%28%5C.%5B0-9a-fA-F%5D*%29%3F%28%5BpP%5D%5B%2B%5C-%5D%3F%5B0-9%5D%2B%29%3F%7C%5E%5B0-9%5D*%28%5C.%5B0-9%5D*%29%3F%28%5BeE%5D%5B%2B%5C-%5D%3F%5B0-9%5D%2B%29%3F%2F
const reNumber =
  /^0[xX][0-9a-fA-F]*(\.[0-9a-fA-F]*)?([pP][+\-]?[0-9]+)?|^[0-9]*(\.[0-9]*)?([eE][+\-]?[0-9]+)?/;

// https://regexper.com/#%2F%28%5E'%28%5C%5C%5C%5C%7C%5C%5C'%7C%5C%5C%5Cn%7C%5C%5Cz%5Cs*%7C%5B%5E'%5Cn%5D%29*'%29%7C%28%5E%22%28%5C%5C%5C%5C%7C%5C%5C%22%7C%5C%5C%5Cn%7C%5C%5Cz%5Cs*%7C%5B%5E%22%5Cn%5D%29*%22%29%2F
const reShortStr =
  /(^'(\\\\|\\'|\\\n|\\z\s*|[^'\n])*')|(^"(\\\\|\\"|\\\n|\\z\s*|[^"\n])*")/;

const reOpeningLongBracket = /^\[=*\[/;

/**
 * @typedef {Object} Location
 * @property {Position} start
 * @property {Position} end
 *
 * @typedef {Object} Position
 * @property {number} line
 * @property {number} column
 * @property {number} offset
 */

// util
/**
 * @param {string} str
 * @returns
 */
function isLetter(str) {
  return str < "a" || (str > "z" && str < "A") || str > "Z";
}
/**
 *
 * @param {string} str
 * @returns
 */
function isDigit(str) {
  return str >= "0" && str <= "9";
}

class Lexer {
  /**
   *
   * @param {string} chunk
   * @param {string} chunkName
   */
  constructor(chunk, chunkName) {
    this.chunk = chunk;
    this.chunkName = chunkName;
    this.line = 0;
    this.linePos = 0;
    this.pos = 0;
    this.nextCacheToken = null;
    this.nextLinePos = 0;
    this.nextLine = 0;
    this.nextPos = 0;
  }

  next(num) {
    this.linePos += num;
    return (this.pos += num);
  }
  get currentChar() {
    return this.chunk[this.pos];
  }

  getLocation() {
    return {
      offset: this.pos,
      line: this.line,
      column: this.linePos,
    };
  }

  isNewLine() {
    return this.currentChar === "\r" || this.currentChar === "\n";
  }
  isWhiteSpace() {
    // '\t', '\n', '\v', '\f', '\r', ' '
    return (
      this.currentChar === "\t" ||
      this.currentChar === " " ||
      this.currentChar === "\v" ||
      this.currentChar === "\f" ||
      this.currentChar === "\r" ||
      this.currentChar === "\n"
    );
  }

  /**
   *
   * @param {RegExp} reg
   */
  execString(reg) {
    return reg.exec(this.chunk.substring(this.pos))?.[0];
  }

  lookAhead() {
    if (this.nextCacheToken) {
      return this.nextCacheToken?.[0];
    }
    let pos = this.pos;
    let line = this.line;
    let linePos = this.linePos;
    let currentToken = this.nextToken();
    this.nextCacheToken = currentToken;
    this.nextLinePos = this.linePos;
    this.nextLine = this.line;
    this.nextPos = this.pos;
    this.pos = pos;
    this.line = line;
    this.linePos = linePos;
    return this.nextCacheToken?.[0];
  }

  nextTokenOfKind(kind) {
    const [_kind, token, location] = this.nextToken();
    if (_kind !== kind) {
      this.error(`expected ${kind} but got ${_kind} token: ${token}`);
    }
    return [_kind, token, location];
  }

  nextIdentifier() {
    return this.nextTokenOfKind(TOKEN_IDENTIFIER);
  }

  skipComment() {
    if (this.test("[")) {
      if (this.execString(reOpeningLongBracket).length) {
        this.scanLongString();
        return;
      }
    }
    while (this.chunk.length > this.pos && !this.isNewLine()) {
      this.next(1);
    }
  }
  scanLongString() {
    let openingLongBracket = this.execString(reOpeningLongBracket);

    let location = {
      start: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
      end: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
    };
    if (!openingLongBracket) {
      this.error(
        `invalid long string delimiter ${this.chunk.substring(
          this.pos,
          this.pos + 2
        )}`
      );
    }

    let closingLongBracket = openingLongBracket.replace(/\[/g, "]");
    let closingLongBracketIdx = this.chunk.indexOf(
      closingLongBracket,
      this.pos
    );
    if (closingLongBracketIdx < 0) {
      this.error("unfinished long string or comment");
    }

    let str = this.chunk.substring(
      this.pos + openingLongBracket.length,
      closingLongBracketIdx
    );
    location.end.offset = this.next(
      openingLongBracket.length + str.length + closingLongBracket.length
    );
    location.end.column = this.getCurrentColumn();
    let newLines = str.split(reNewLine);
    this.line += newLines;
    if (newLines.length) {
      this.linePos = newLines[newLines.length - 1].length;
    }
    // this.linePos += this.pos;

    if (str.length && str[0] === "\n") {
      str = str.substring(1);
    }
    return [str, location];
  }

  skipWhiteSpace() {
    while (this.pos < this.chunk.length) {
      if (this.test("--")) {
        this.next(2);
        this.skipComment();
      } else if (this.isNewLine()) {
        this.next(1);
        this.line++;
        this.linePos = 0;
      } else if (this.test("\r\n") || this.test("\n\r")) {
        this.next(2);
        this.line++;
        this.linePos = 0;
      } else if (this.isWhiteSpace()) {
        this.next(1);
      } else {
        break;
      }
    }
  }
  escape(str) {
    let result = "";
    while (str.length) {
      if (str[0] != "\\") {
        result += str[0];
        str = str.substring(1);
        continue;
      }
      // '\'
      if (str.length === 1) {
        this.error("unfinished string end \\");
      }
      let newLines = ["\r", "\n"];
      let commonEscape = ["a", "b", "f", "n", "r", "t", "v", '"', "'", "\\"];
      let asciiEscape = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      let hexEscape = ["x"];
      let unicodeEscape = ["u"];
      // 忽略换行
      if (newLines.includes(str[1])) {
        str = str.substring(2);
        continue;
      }

      if (commonEscape.includes(str[1])) {
        result += str.substring(1, 2);
        str = str.substring(1);
        continue;
      }
      if (asciiEscape.includes(str[1])) {
        let code = str.match(reDecEscapeSeq)?.[0];
        let d = parseInt(code.substring(1), 10);
        if (d <= 0xff) {
          result += String.fromCodePoint(d);
          str = str.substring(code.length);
          continue;
        }
        this.error(`decimal escape sequence out of range: ${code}`);
      }
      if (hexEscape.includes(str[1])) {
        let code = str.match(reHexEscapeSeq)?.[0];
        result += String.fromCodePoint(parseInt(code.substring(2), 16));
        str = str.substring(code.length);
        continue;
      }
      if (unicodeEscape.includes(str[1])) {
        let code = str.match(reUnicodeEscapeSeq)?.[0];
        let d = parseInt(code.substring(3, code.length - 1), 16);
        if (d <= 0x10ffff) {
          result += String.fromCodePoint(d);
          str = str.substring(code.length);
          continue;
        }
        this.error(`unicode escape sequence out of range: ${code}`);
      }
      this.error(`invalid escape sequence: \\${str[0]}`);
    }
    return result;
  }
  scanShortString() {
    let str = this.execString(reShortStr);
    let location = {
      start: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
      end: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
    };
    if (str) {
      location.end.offset = this.next(str.length);
      str = str.substring(1, str.length - 1); // remove ' or "
      if (str.indexOf("\\") >= 0) {
        let reNewlines = str.split(reNewLine);
        this.line += reNewlines.length - 1;
        if (reNewlines.length > 1) {
          // str"
          this.linePos = reNewlines[reNewlines.length - 1].length + 1;
        } else {
          this.linePos = str.length;
        }
        location.end.line = this.line;
        str = this.escape(str);
      }
      location.end.column = this.getCurrentColumn();
      return [str, location];
    }
    this.error("unfinished string");
  }
  scanIdentifier() {
    return this.scan(reIdentifier);
  }
  scanNumber() {
    return this.scan(reNumber);
  }

  getCurrentColumn() {
    return this.linePos;
  }
  scan(re) {
    let str = this.execString(re);
    let location = {
      start: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos-1,
      },
      end: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
    };
    if (str) {
      location.end.offset = this.next(str.length)-1;
      location.end.column = this.getCurrentColumn();
      return [str, location];
    }
    this.error("unreachable");
  }
  test(str) {
    return this.chunk.startsWith(str, this.pos);
  }

  /**
   *
   * @returns {[string,string,Location]}
   */
  nextToken() {
    if (this.nextCacheToken) {
      const nextCacheToken = this.nextCacheToken;
      this.pos = this.nextPos;
      this.linePos = this.nextLinePos;
      this.line = this.nextLine;
      this.nextCacheToken = null;
      return nextCacheToken;
    }
    this.skipWhiteSpace();

    if (this.pos >= this.chunk.length) {
      return [TOKEN_EOF, "EOF"];
    }
    let location = {
      start: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos - 1,
      },
      end: {
        line: this.line,
        column: this.getCurrentColumn(),
        offset: this.pos,
      },
    };
    switch (this.currentChar) {
      case ";":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_SEMI, ";", location];
      case ",":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_COMMA, ",", location];
      case "(":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_LPAREN, "(", location];
      case ")":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_RPAREN, ")", location];
      case "]":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_RBRACK, "]", location];
      case "{":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_LCURLY, "{", location];
      case "}":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_SEP_RCURLY, "}", location];
      case "+":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_ADD, "+", location];
      case "-":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_MINUS, "-", location];
      case "*":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_MUL, "*", location];
      case "^":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_POW, "^", location];
      case "%":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_MOD, "%", location];
      case "&":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_BAND, "&", location];
      case "|":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_BOR, "|", location];
      case "#":
        this.next(1);
        location.end.column = this.getCurrentColumn();
        return [TOKEN_OP_LEN, "#", location];
      case ":":
        if (this.test("::")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_SEP_LABEL, "::", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_SEP_COLON, ":", location];
        }
      case "/":
        if (this.test("//")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_IDIV, "//", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_DIV, "/", location];
        }
      case "~":
        if (this.test("~=")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_NE, "~=", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_WAVE, "~", location];
        }
      case "=":
        if (this.test("==")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_EQ, "==", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_ASSIGN, "=", location];
        }
      case "<":
        if (this.test("<<")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_SHL, "<<", location];
        } else if (this.test("<=")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_LE, "<=", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_LT, "<", location];
        }
      case ">":
        if (this.test(">>")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_SHR, ">>", location];
        } else if (this.test(">=")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_GE, ">=", location];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_GT, ">", location];
        }
      case ".":
        if (this.test("...")) {
          location.end.offset = this.pos + 2;
          this.next(3)
          location.end.column = this.getCurrentColumn();
          return [TOKEN_VARARG, "...", location];
        } else if (this.test("..")) {
          location.end.offset = this.pos + 1;
          this.next(2);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_OP_CONCAT, "..", location];
        } else if (!isDigit(this.chunk[this.pos + 1])) {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_SEP_DOT, ".", location];
        }
        break;
      case "[":
        if (this.test("[[") || this.test("[=")) {
          return [TOKEN_STRING, ...this.scanLongString()];
        } else {
          this.next(1);
          location.end.column = this.getCurrentColumn();
          return [TOKEN_SEP_LBARCK, "[", location];
        }
      case "'":
      case '"':
        return [TOKEN_STRING, ...this.scanShortString()];
    }

    if (this.currentChar === "." || isDigit(this.currentChar)) {
      return [TOKEN_NUMBER, ...this.scanNumber()];
    }

    if (this.currentChar === "_" || isLetter(this.currentChar)) {
      let identifier = this.scanIdentifier();
      if (keywords[identifier[0]]) {
        return [keywords[identifier[0]], ...identifier];
      } else {
        return [TOKEN_IDENTIFIER, ...identifier];
      }
    }

    this.error(`unexpected symbol near '${this.currentChar}'`);
  }

  error(msg) {
    console.error(msg);
    throw new Error(msg);
  }
}

if (typeof window === "undefined") {
  const lodash = require("lodash");
  let lexer = new Lexer(`
local
"abc\\
def"
"abff"
`);

  const t = (a, b) => {
    if (!lodash.isEqual(a, b)) {
      console.log(a, b);
      throw Error("not equal");
    }
  };

  t(lexer.nextToken(), [
    TOKEN_KW_LOCAL,
    "local",
    {
      start: { offset: 1, line: 1, column: 0 },
      end: { offset: 6, line: 1, column: 5 },
    },
  ]);
  t(lexer.nextToken(), [
    TOKEN_STRING,
    "abcdef",
    {
      start: { offset: 7, line: 2, column: 0 },
      end: { offset: 17, line: 3, column: 4 },
    },
  ]);
  t(lexer.nextToken(), [
    TOKEN_STRING,
    "abff",
    {
      start: { offset: 18, line: 4, column: 0 },
      end: { offset: 24, line: 4, column: 6 },
    },
  ]);
}
