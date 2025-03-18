/**
 * @typedef {import('./lua-token').Node} Node
 */
/**
 *
 * @param {Node} node
 */
function gen(node) {
  const NodeName = node.constructor.name;
  if (nodeGenMap[NodeName]) {
    return nodeGenMap[NodeName](node);
  } else {
    console.log(node);
    return "\nnot match node: " + NodeName;
  }
}

const nodeGenMap = {
  Block: (blockNode) => {
    const stats = blockNode.stats.map(gen).join("");
    return `${stats}`;
  },
  EmptyStat: () => ";",
  FuncCallExp: (funCallExpNode) => {
    const prefixExp = gen(funCallExpNode.prefixExp);
    const args = funCallExpNode.args.map(gen).join(", ");
    return `${prefixExp}(${args})`;
  },
  StringExp: (stringExpNode) => `"${stringExpNode.string}"`,
  NameExp: (nameExpNode) => nameExpNode.name,
  LocalVarDeclStat: (localVarDeclStatNode) => {
    let str = "";
    for (let i in localVarDeclStatNode.nameList) {
      const name = localVarDeclStatNode.nameList[i];
      const exp = localVarDeclStatNode.expList[i];
      const expStr = exp ? gen(exp) : "";
      str += `let ${name} = ${expStr}\n`;
    }
    return str;
  },
  IntegerExp: (integerExpNode) => integerExpNode.val,
  TableAccessExp: (tableAccessExpNode) => {
    const prefixExp = gen(tableAccessExpNode.prefixExp);
    const exp = gen(tableAccessExpNode.keyExp);
    return `${prefixExp}[${exp}]`;
  },
  AssignStat: (assignStatNode) => {
    let str = "";
    for (let i in assignStatNode.varList) {
      const varName = gen(assignStatNode.varList[i]);
      const exp = assignStatNode.expList[i];
      const expStr = exp ? gen(exp) : "";
      str += `${varName} = ${expStr}\n`;
    }
    return str;
  },
  ConcatExp: (concatExpNode) => {
    const str = concatExpNode.expList.map(gen).join("+")
    return str;
  },
};
