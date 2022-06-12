class Node {
  constructor(location) {
    this.location = location;
  }
}
class Block extends Node {
  constructor(stats, retStat, location) {
    super(location);
    this.stats = stats;
    this.retStat = retStat;
  }
}

class EmptyStat extends Node {} // ;
class BreakStat extends Node {} // bread

/**
 * '::' Name '::'
 */
class LabelStat extends Node {
  constructor(name, location) {
    super(location);
    this.name = name;
  }
}

/**
 * goto Name
 */
class GotoStat extends Node {
  constructor(name, location) {
    super(location);
    this.name = name;
  }
}

/**
 * do block end
 */
class DoStat extends Node {
  constructor(block, location) {
    super(location);
    this.block = block;
  }
}

/**
 * while exp do blok end
 */
class WhileStat extends Node {
  constructor(exp, block, location) {
    super(location);
    this.exp = exp;
    this.block = block;
  }
}

/**
 * repeat block until exp
 */
class RepeatStat extends Node {
  constructor(block, exp, location) {
    super(location);
    this.block = block;
    this.exp = exp;
  }
}

/**
 * if exp then block {elseif exp then block} end
 */
class IfStat extends Node {
  constructor(exps, blocks, location) {
    super(location);
    this.exps = exps ?? [];
    this.block = blocks ?? [];
  }
}

/**
 * for Name '=' exp ',' exp [',' exp] do block end
 */
class ForNumStat extends Node {
  constructor({
    locationOfDo,
    locationOfFor,
    varName,
    initExp,
    limitExp,
    stepExp,
    block,
    location,
  }) {
    super(location);
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
class ForInStat extends Node {
  constructor({ locationOfDo, nameList, expList, block, location }) {
    super(location);
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

class AssignStat extends Node {
  constructor(varList, expList, location) {
    super(location);
    this.varList = varList;
    this.expList = expList;
  }
}

class LocalFuncDeclStat extends Node {
  constructor(name, exp, location) {
    super(location)
    this.name = name;
    this.exp = exp;
  }
}

/**
 * Exp
 */

class Exp extends Node {}
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
  constructor(location, parList, isVarArg, block) {
    super(location);
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
