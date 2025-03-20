import bcrypt from "bcryptjs";
import {IssueCode, PasswordData, PasswordTest, ValidationError, ValidationIssue} from "./types";


const rules: Record<string, number> = {
  minLength: 6,
  maxLength: 130,
};

const rulesRegex: Record<string, RegExp> = {
  upperLookahead: /(?=.*[A-Z])/,
  lowerLookahead: /(?=.*[a-z])/,
  numberLookahead: /(?=.*[0-9])/,
  specialCharacterLookahead: /(?=.*[!@#$%^&*()_+\-=[\]{};':"|,.<>/?])/,
};

const passwordTests: [PasswordTest, ValidationIssue][] = [
  [
    p => p.length < rules.minLength,
    {
      code: IssueCode.TooSmall,
      type: "string",
      message: `Password is too short. It must be at least ${rules.minLength} characters long.`,
      minimum: rules.minLength,
      inclusive: true,
      path: ["password"],
    }
  ],
  [
    p => p.length > rules.maxLength,
    {
      code: IssueCode.TooBig,
      type: "string",
      message: `Password can be only ${rules.maxLength} characters long.`,
      maximum: rules.maxLength,
      inclusive: true,
      path: ["password"],
    }
  ],
  [
    p => !rulesRegex.lowerLookahead.test(p),
    {
      code: IssueCode.InvalidStringFormat,
      message: "Password must contain at least one lowercase letter.",
      path: ["password"],
      type: "letter",
      stringCase: "lowercase",
    }
  ],
  [
    p => !rulesRegex.upperLookahead.test(p),
    {
      code: IssueCode.InvalidStringFormat,
      message: "Password must contain at least one uppercase letter.",
      path: ["password"],
      type: "letter",
      stringCase: "uppercase",
    }
  ],
  [
    p => !rulesRegex.numberLookahead.test(p),
    {
      code: IssueCode.InvalidStringFormat,
      message: "Password must contain at least one number.",
      path: ["password"],
      type: "number",
    }
  ],
  [
    p => !rulesRegex.specialCharacterLookahead.test(p),
    {
      code: IssueCode.InvalidStringFormat,
      message: "Password must contain at least one special character.",
      path: ["password"],
      type: "symbol",
    }
  ],
];

function validate(inputPassword: string): void {
  const issues: ValidationIssue[] = [];
  for (const [test, issue] of passwordTests)
    if (test(inputPassword))
      issues.push(issue);
  if (issues.length > 0)
    throw new ValidationError("Password validation error", issues);
}

function create(inputPassword: string): PasswordData {
  validate(inputPassword);
  return { hash: bcrypt.hashSync(inputPassword, 12), type: "BCRYPT" };
}

export default {
  validate,
  create,
};