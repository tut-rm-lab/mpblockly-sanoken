import { categoryPin } from './blocks/pin';
import {
  defineBlock,
  defineCategory,
  defineCategoryToolbox,
  defineDynamicCategory,
} from './utils';

export default defineCategoryToolbox([
  defineCategory(
    { name: '条件分岐' },
    [
      'controls_if',
      'controls_ifelse',
      'logic_compare',
      'logic_operation',
      'logic_negate',
      'logic_boolean',
    ].map((type) => defineBlock({ type })),
  ),
  defineCategory(
    { name: 'ループ' },
    [
      'controls_repeat_ext',
      'controls_repeat',
      'controls_whileUntil',
      'controls_for',
      'controls_forEach',
      'controls_flow_statements',
    ].map((type) => defineBlock({ type })),
  ),
  defineCategory(
    { name: '数学' },
    [
      'math_number',
      'math_arithmetic',
      'math_single',
      'math_trig',
      'math_constant',
      'math_number_property',
      'math_change',
      'math_round',
      'math_on_list',
      'math_modulo',
      'math_constrain',
      'math_random_int',
      'math_random_float',
      'math_atan2',
    ].map((type) => defineBlock({ type })),
  ),
  defineCategory(
    { name: 'テキスト' },
    ['text', 'text_join', 'text_length', 'text_print'].map((type) =>
      defineBlock({ type }),
    ),
  ),
  defineCategory(
    { name: '配列' },
    [
      'lists_create_empty',
      'lists_repeat',
      'lists_reverse',
      'lists_isEmpty',
      'lists_length',
      'lists_create_with',
      'lists_create_with_container',
      'lists_create_with_item',
      'lists_indexOf',
      'lists_getIndex',
      'lists_setIndex',
      'lists_getSublist',
      'lists_sort',
      'lists_split',
    ].map((type) => defineBlock({ type })),
  ),
  defineDynamicCategory({ name: '変数', custom: 'VARIABLE' }),
  defineDynamicCategory({ name: '関数', custom: 'PROCEDURE' }),
  categoryPin,
]);
