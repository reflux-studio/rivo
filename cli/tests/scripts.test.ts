import { describe, expect, it } from "vitest";
import { renderTemplate, unknownVars } from "../src/scripts.js";

describe("renderTemplate", () => {
  it("按空格切成 argv", () => {
    expect(renderTemplate("mycli issue assign {issue_slug}", { issue_slug: "fix-login" })).toEqual([
      "mycli",
      "issue",
      "assign",
      "fix-login",
    ]);
  });

  it("含空格的变量值仍然是一个 argv 元素", () => {
    expect(renderTemplate("mycli comment {reason}", { reason: "迁移成本 被低估" })).toEqual([
      "mycli",
      "comment",
      "迁移成本 被低估",
    ]);
  });

  it("变量值里的 shell 元字符原样传递,不被解释", () => {
    const argv = renderTemplate("mycli comment {reason}", {
      reason: "`rm -rf /` && $(whoami)",
    });
    expect(argv).toEqual(["mycli", "comment", "`rm -rf /` && $(whoami)"]);
  });

  it("变量与固定文本拼在同一个词里也算一个元素", () => {
    expect(renderTemplate("mycli --id={agent_ref}", { agent_ref: "a b" })).toEqual([
      "mycli",
      "--id=a b",
    ]);
  });

  it("缺失的变量替换成空串", () => {
    expect(renderTemplate("mycli {reason}", {})).toEqual(["mycli", ""]);
  });

  it("多余空格不产生空 argv", () => {
    expect(renderTemplate("mycli   issue", {})).toEqual(["mycli", "issue"]);
  });
});

describe("unknownVars", () => {
  it("挑出不在变量表里的变量", () => {
    expect(unknownVars("mycli {agnet_ref} {issue_slug} {nope}").sort()).toEqual([
      "agnet_ref",
      "nope",
    ]);
  });

  it("全部合法时返回空数组", () => {
    expect(unknownVars("mycli {agent_ref} {node}")).toEqual([]);
  });
});
