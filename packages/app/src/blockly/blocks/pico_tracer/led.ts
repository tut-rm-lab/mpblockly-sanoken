import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../../utils.js';

const turnOnBuiltinLED = defineBlock({ type: 'mpblockly_turn_on_builtin_led' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '内蔵LEDを点灯する',
            previousStatement: null,
            nextStatement: null,
            colour: 165,
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
        generator.provideFunction_('mpblockly_led_instance', 'led = Pin(\'LED\', Pin.OUT)');
        return `led.on()\n`;
    };
});

const turnOffBuiltinLED = defineBlock({ type: 'mpblockly_turn_off_builtin_led' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '内蔵LEDを消灯する',
            previousStatement: null,
            nextStatement: null,
            colour: 165,
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
        generator.provideFunction_('mpblockly_led_instance', 'led = Pin(\'LED\', Pin.OUT)');
        return `led.off()\n`;
    };
});

export default defineCategory({ name: 'LED' }, [turnOnBuiltinLED, turnOffBuiltinLED]);
