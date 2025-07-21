import type * as Blockly from 'blockly/core';

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
    contents: StaticCategory[];
  }
>;

export type StaticCategory = Merge<
  MakeUndefinedOptional<Blockly.utils.toolbox.StaticCategoryInfo>,
  {
    kind: 'category';
    contents: (StaticCategory | FlyoutItem)[];
  }
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

export function flyoutToolbox(contents: Block[]): FlyoutToolbox {
  return {
    kind: 'flyoutToolbox',
    contents,
  };
}

export function categoryToolbox(contents: StaticCategory[]): CategoryToolbox {
  return {
    kind: 'categoryToolbox',
    contents,
  };
}

export function category(
  options: Omit<StaticCategory, 'kind' | 'contents'>,
  contents: (StaticCategory | FlyoutItem)[],
): StaticCategory {
  return {
    ...options,
    kind: 'category',
    contents,
  };
}

export function block(
  options: Omit<Block, 'kind'>,
  blockDefinition?: (type: string) => void,
): Block {
  blockDefinition?.(options.type);
  return {
    kind: 'block',
    type: options.type,
  };
}

export function separator(options?: Omit<Separator, 'kind'>): Separator {
  return {
    ...options,
    kind: 'sep',
  };
}

export function button(options: Omit<Button, 'kind'>): Button {
  return {
    ...options,
    kind: 'button',
  };
}

export function label(options: Omit<Label, 'kind'>): Label {
  return {
    ...options,
    kind: 'label',
  };
}
