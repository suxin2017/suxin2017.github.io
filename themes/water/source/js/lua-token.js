class Block {
  constructor(stats, retStat, location) {
    this.stats = stats;
    this.retStat = retStat;
    this.location = location;
  }
}

class EmptyStat {} // ;
class BreakStat {
  constructor(location) {
    this.location = location;
  }
} // bread

/**
 * '::' Name '::'
 */
class LabelStat {
  constructor(name) {
    this.name = name;
  }
}

/**
 * goto Name
 */
class GotoStat {
  constructor(name) {
    this.name = name;
  }
}

/**
 * do block end
 */
class DoStat {
  constructor(block) {
    this.block = block;
  }
}

/**
 * while exp do blok end
 */
class WhileStat {
  constructor(exp, block) {
    this.exp = exp;
    this.block = block;
  }
}

/**
 * repeat block until exp
 */
class RepeatStat {
  constructor(block, exp) {
    this.block = block;
    this.exp = exp;
  }
}

/**
 * if exp then block {elseif exp then block} end
 */
class IfStat {
  constructor(exps, blocks) {
    this.exps = exps ?? [];
    this.block = blocks ?? [];
  }
}

/**
 * for Name '=' exp ',' exp [',' exp] do block end
 */
class ForNumStat {
  constructor({
    locationOfDo,
    locationOfFor,
    varName,
    initExp,
    limitExp,
    stepExp,
    block,
  }) {
    this.locationOfFor = locationOfFor;
    this.locationOfDo = locationOfDo;
    this.varName = varName;
    this.initExp = initExp;
    this.limitExp = limitExp;
    this.stepExp = stepExp;
    this.block = block;
  }
}

/**
 * for nameList in expList do block end
 */
class ForInStat {
  constructor({ locationOfDo, nameList, expList, block }) {
    this.locationOfDo = locationOfDo;
    this.nameList = nameList;
    this.expList = expList;
    this.block = block;
  }
}

/**
 * local nameList ['=' expList]
 */
class LocalVarDeclStat {
  constructor(lastLocation, nameList, expList) {
    this.lastLocation = lastLocation;
    this.nameList = nameList;
    this.expList = expList;
  }
}

class AssignStat {
  constructor(lastLocation, varList, expList) {
    this.lastLocation = lastLocation;
    this.varList = varList;
    this.expList = expList;
  }
}

class LocalFuncDeclStat {
  constructor(name, exp) {
    this.name = name;
    this.exp = exp;
  }
}

/**
 * Exp
 */

class Exp {
  constructor(location) {
    this.location = location;
  }
}
class NilExp extends Exp {}
class TrueExp extends Exp {}
class FalseExp extends Exp {}
class VarArgExp extends Exp {}
class IntegerExp extends Exp {
  constructor(location, val) {
    super(location);
    this.val = val;
  }
}
class FloatExp extends Exp {
  constructor(location, val) {
    super(location);
    this.val = val;
  }
}
class StringExp extends Exp {
  constructor(location, string) {
    super(location);
    this.string = string;
  }
}
class NameExp extends Exp {
  constructor(location, name) {
    super(location);
    this.name = name;
  }
}

class UnOpExp extends Exp {
  constructor(location, op, exp) {
    super(location);
    this.op = op;
    this.exp = exp;
  }
}

class BinOpExp extends Exp {
  constructor(location, op, exp1, exp2) {
    super(location);
    this.op = op;
    this.exp1 = exp1;
    this.exp2 = exp2;
  }
}

class ConcatExp {
  constructor(location, expList) {
    this.location = location;
    this.expList = expList;
  }
}

class TableConstructorExp extends Exp {
  constructor(location, endLocation, keyExps, valExps) {
    super(location);
    this.endLocation = endLocation;
    this.keyExps = keyExps;
    this.valExps = valExps;
  }
}

class FuncDefExp extends Exp {
  constructor(location, endLocation, parList, isVarArg, block) {
    super(location);
    this.endLocation = endLocation;
    this.parList = parList;
    this.isVarArg = isVarArg;
    this.block = block;
  }
}

class ParensExp {
  constructor(exp) {
    this.exp = exp;
  }
}

class TableAccessExp {
  constructor(location, prefixExp, keyExp) {
    this.location = location;
    this.prefixExp = prefixExp;
    this.keyExp = keyExp;
  }
}

class FuncCallExp {
  constructor(location, lastLocation, prefixExp, nameExp, args) {
    this.location = location;
    this.lastLocation = lastLocation;
    this.prefixExp = prefixExp;
    this.nameExp = nameExp;
    this.args = args;
  }
}

/**
 * 函数调用语句和函数调用表达式一样
 */
class FuncCallStat extends FuncCallExp {}
