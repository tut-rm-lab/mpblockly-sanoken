import pin from './blocks/pin.js';
import pwm from './blocks/pwm.js';
import time from './blocks/time.js';
import {
  defineBlock,
  defineCategory,
  defineCategoryToolbox,
  defineDynamicCategory,
  defineSeparator,
} from './utils.js';
import led from './blocks/pico_tracer/led.js';
import neopixel from './blocks/pico_tracer/neopixel.js';
import sensor from './blocks/pico_tracer/sensor.js';
import motor from './blocks/pico_tracer/motor.js';

export default defineCategoryToolbox([
  defineCategory(
    { name: '条件分岐' },
    [
      'logic_boolean',
      'logic_negate',
      'logic_compare',
      'logic_operation',
      'controls_if',
      'controls_ifelse',
    ].map((type) => defineBlock({ type })),
  ),
  defineCategory(
    { name: 'ループ' },
    [
      'controls_repeat_ext',
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
      'math_constant',
      'math_arithmetic',
      'math_modulo',
      'math_single',
      'math_trig',
      'math_atan2',
      'math_round',
      'math_constrain',
      'math_on_list',
      'math_random_float',
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
      'lists_create_with',
      'lists_getIndex',
      'lists_setIndex',
      'lists_length',
      'lists_reverse',
      'lists_sort',
    ].map((type) => defineBlock({ type })),
  ),
  defineDynamicCategory({ name: '変数', custom: 'VARIABLE' }),
  defineDynamicCategory({ name: '関数', custom: 'PROCEDURE' }),
  defineSeparator(),
  time,
  led,
  neopixel,
  sensor,
  motor
]);
