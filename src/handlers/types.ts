import {User} from "../user-entity/users/types";
import {Confirm} from "../user-entity/confirm/types";

class BaseHttpError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

class HttpError extends BaseHttpError {
  errorName: string;
  errorCode?: string;

  constructor(
    message = "Application error",
    code = 422,
    errorCode?: string,
    errorName?: string
  ) {
    super(message, code);
    this.errorName = errorName ?? ErrorName.AppError;
    this.message = message;
    this.errorCode = errorCode;
  }
}

enum ErrorName {
  AppError = "AppError",
  ValidationError = "ValidationError",
}

export enum IssueCode {
  InvalidType = "InvalidType",
  UnrecognizedKeys = "UnrecognizedKeys",
  InvalidDate = "InvalidDate",
  InvalidEnumValue = "InvalidEnumValue",
  InvalidString = "InvalidString",
  InvalidStringFormat = "InvalidStringFormat",
  TooSmall = "TooSmall",
  TooBig = "TooBig",
  NotMultipleOf = "NotMultipleOf",
  Custom = "Custom",
}

type StringType = "email" | "url" | "uuid" | "regex" | "cuid" | "datetime" | "unsupported"
type SizeType = "string" | "number" | "date" | "array" | "set"
type StringFormatIssueType = "letter" | "number" | "symbol"
type StringFormatCaseType = "lowercase" | "uppercase"

interface BaseIssue {
  message: string
  path: (string | number)[]
}

enum DataType {
  function = "function",
  number = "number",
  string = "string",
  nan = "nan",
  integer = "integer",
  float = "float",
  boolean = "boolean",
  date = "date",
  bigint = "bigint",
  symbol = "symbol",
  undefined = "undefined",
  null = "null",
  array = "array",
  object = "object",
  unknown = "unknown",
  promise = "promise",
  void = "void",
  never = "never",
  map = "map",
  set = "set",
}

interface InvalidTypeIssue extends BaseIssue {
  code: IssueCode.InvalidType
  expected: DataType | string
  received: DataType | string
}

interface UnrecognizedKeysIssue extends BaseIssue {
  code: IssueCode.UnrecognizedKeys
  keys: string[]
}

interface InvalidDateIssue extends BaseIssue {
  code: IssueCode.InvalidDate
}

interface InvalidEnumValueIssue extends BaseIssue {
  code: IssueCode.InvalidEnumValue
  options: (string | number)[]
}

interface InvalidStringIssue extends BaseIssue {
  code: IssueCode.InvalidString
  validation: StringType
}

interface InvalidStringFormatIssue extends BaseIssue {
  code: IssueCode.InvalidStringFormat
  type: StringFormatIssueType
  stringCase?: StringFormatCaseType
}

interface TooBigIssue extends BaseIssue {
  code: IssueCode.TooBig
  type: SizeType
  maximum: number
  inclusive: boolean
}

interface TooSmallIssue extends BaseIssue {
  code: IssueCode.TooSmall
  type: SizeType
  minimum: number
  inclusive: boolean
}

interface NotMultipleOfIssue extends BaseIssue {
  code: IssueCode.NotMultipleOf
  multipleOf: number
}

interface CustomIssue extends BaseIssue {
  code: IssueCode.Custom
}

export type ValidationIssue =
  | InvalidDateIssue
  | InvalidTypeIssue
  | UnrecognizedKeysIssue
  | InvalidEnumValueIssue
  | InvalidStringIssue
  | InvalidStringFormatIssue
  | TooBigIssue
  | TooSmallIssue
  | NotMultipleOfIssue
  | CustomIssue

export class ValidationError extends HttpError {
  issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[]) {
    super(message, 400);
    this.message = message;
    this.errorName = ErrorName.ValidationError;
    this.issues = issues;
  }
}

export interface PasswordData {
  hash: string;
  type: string;
}

export enum Platform {
  HEU = "HEU",
  OCS = "OCS",
  CEN = "CEN",
}

export enum CountryCode {
  CZ = "CZ",
  SK = "SK",
  HU = "HU",
  BG = "BG",
  RO = "RO",
  SI = "SI",
  HR = "HR",
  RS = "RS",
  BA = "BA",
}

export enum Language {
  CS = "cs",
  SK = "sk",
  HU = "hu",
  SL = "sl",
  RO = "ro",
  BG = "bg",
  HR = "hr",
  SR = "sr",
  SR_CYRL = "sr-Cyrl",
  BS = "bs",
  EN = "en",
  EN_US = "en-US",
  EN_GB = "en-GB",
}

export interface Input {
  email: string
  password: string
  platformId: Platform
  countryCode: CountryCode
  language: Language
  newsletter: boolean
  activationCallbackUrl: string
}

export enum EntityName {
  USER = "user",
  PRODUCER = "producer",
}

export interface EntityUUIDNamespaceParams {
  entityName: string
  countryCode: CountryCode
  platformId: Platform
}

export interface EntityUUIDParams {
  entityName: string
  entityRecordId: string
  namespaceMap: Record<string, string>
  countryCode: CountryCode
  platformId: Platform
}

export type PasswordTest = (password: string) => boolean;

export interface RegisteredUserResult {
  user: User
  confirm: Confirm
}