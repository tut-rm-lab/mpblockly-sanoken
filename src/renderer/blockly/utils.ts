import * as Blockly from 'blockly/core';

type Merge<T, U> = Omit<T, keyof U> & U;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type MakeUndefinedOptional<T> = PartialBy<
  T,
  {
    [K in keyof T]: undefined extends T[K] ? K : never;
  }[keyof T]
>;

export type Toolbox = FlyoutToolbox | CategoryToolbox;

export type FlyoutToolbox = Merge<
  Blockly.utils.toolbox.ToolboxInfo,
  {
    kind: 'flyoutToolbox';
    contents: FlyoutItem[];
  }
>;

export type CategoryToolbox = Merge<
  Blockly.utils.toolbox.ToolboxInfo,
  {
    kind: 'categoryToolbox';
    contents: Category[];
  }
>;

export type Category = StaticCategory | DynamicCategory | Separator;

export type StaticCategory = Merge<
  MakeUndefinedOptional<Blockly.utils.toolbox.StaticCategoryInfo>,
  {
    kind: 'category';
    contents: (Category | FlyoutItem)[];
  }
>;

export type DynamicCategory = Merge<
  MakeUndefinedOptional<Blockly.utils.toolbox.DynamicCategoryInfo>,
  { kind: 'category'; name: string }
>;

export type FlyoutItem = Block | Separator | Button | Label;

export type Block = Merge<
  Blockly.utils.toolbox.BlockInfo,
  {
    kind: 'block';
    type: string;
  }
>;

export type Separator = Merge<
  MakeUndefinedOptional<Blockly.utils.toolbox.SeparatorInfo>,
  {
    kind: 'sep';
  }
>;

export type Button = Merge<
  Blockly.utils.toolbox.ButtonInfo,
  {
    kind: 'button';
  }
>;

export type Label = Merge<
  MakeUndefinedOptional<Blockly.utils.toolbox.LabelInfo>,
  {
    kind: 'label';
  }
>;

export function defineOptions(
  options: Blockly.BlocklyOptions,
): Blockly.BlocklyOptions {
  return options;
}

export function defineTheme(
  options: Parameters<typeof Blockly.Theme.defineTheme>[1],
): Blockly.Theme {
  const { name } = options;
  return Blockly.Theme.defineTheme(name, options);
}

export function defineFlyoutToolbox(contents: Block[]): FlyoutToolbox {
  return {
    kind: 'flyoutToolbox',
    contents,
  };
}

export function defineCategoryToolbox(contents: Category[]): CategoryToolbox {
  return {
    kind: 'categoryToolbox',
    contents,
  };
}

export function defineCategory(
  options: Omit<StaticCategory, 'kind' | 'contents'>,
  contents: (Category | FlyoutItem)[],
): StaticCategory {
  return {
    ...options,
    kind: 'category',
    contents,
  };
}

export function defineDynamicCategory(
  options: Omit<DynamicCategory, 'kind'>,
  callback?: (workspace: Blockly.WorkspaceSvg) => FlyoutItem[],
): DynamicCategory {
  if (callback) {
    callOnWorkspaceInit.add((workspace) => {
      workspace.registerToolboxCategoryCallback(options.custom, callback);
    });
  }
  return {
    ...options,
    kind: 'category',
  };
}

export function defineBlock(
  options: Omit<Block, 'kind'>,
  blockDefinition?: (type: string) => void,
): Block {
  blockDefinition?.(options.type);
  return {
    kind: 'block',
    type: options.type,
  };
}

export function defineSeparator(options?: Omit<Separator, 'kind'>): Separator {
  return {
    ...options,
    kind: 'sep',
  };
}

export function defineButton(options: Omit<Button, 'kind'>): Button {
  return {
    ...options,
    kind: 'button',
  };
}

export function defineLabel(options: Omit<Label, 'kind'>): Label {
  return {
    ...options,
    kind: 'label',
  };
}

export const callOnWorkspaceInit = new Set<
  (workspace: Blockly.WorkspaceSvg) => void
>();
