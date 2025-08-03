import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { defineBlock, defineCategory } from '../../utils.js';
import { /*colourBlend,*/ colourPicker, colourRandom, colourRgb } from '@blockly/field-colour';


/*
colourBlend.installBlock({
    python: pythonGenerator
});
*/

colourPicker.installBlock({
    python: pythonGenerator
});
colourRandom.installBlock({
    python: pythonGenerator
});
colourRgb.installBlock({
    python: pythonGenerator
});

// const hexToRgb = Blockly.utils.colour.hexToRgb;
// const parseColour = Blockly.utils.colour.parse;

const hexToRgbInstr = (hex: string): string =>
    `(lambda c: (int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)))(${hex})`;

/* 無駄の極み */
const rgbInstrToHex = (r: string, g: string, b: string): string => {
    const rn = Number(r);
    const gn = Number(g);
    const bn = Number(b);
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    const hex = (v: number) => v.toString(16).padStart(2, '0');
    return `'#${hex(clamp(rn))}${hex(clamp(gn))}${hex(clamp(bn))}'`;
};

// const colorBlendBlock = defineBlock({ type: 'colour_blend' }, () => { });
const colourPickerBlock = defineBlock({ type: 'colour_picker' }, () => { });
const colourRandomBlock = defineBlock({ type: 'colour_random' }, () => { });
// const colourRgbBlock = defineBlock({ type: 'colour_rgb' }, () => { });

const colourRgbBlock = defineBlock({
    type: 'mpblockly_colour_rgb',
    inputs: {
        RED: {
            shadow: {
                type: 'math_number',
                fields: {
                    NUM: 255,
                },
            },
        },
        GREEN: {
            shadow: {
                type: 'math_number',
                fields: {
                    NUM: 0,
                },
            },
        },
        BLUE: {
            shadow: {
                type: 'math_number',
                fields: {
                    NUM: 0,
                },
            },
        },
    }
}, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: 'R %1 G %2 B %3',
            args0: [
                {
                    type: 'input_value',
                    name: 'RED',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'GREEN',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'BLUE',
                    check: 'Number',
                },
            ],
            output: 'Colour',
            helpUrl: '%{BKY_COLOUR_RGB_HELPURL}',
            style: 'colour_blocks',
            inputsInline: true,
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        const r = generator.valueToCode(block, 'RED', Order.ATOMIC);
        const g = generator.valueToCode(block, 'GREEN', Order.ATOMIC);
        const b = generator.valueToCode(block, 'BLUE', Order.ATOMIC);
        const code = `${rgbInstrToHex(r, g, b)}`;
        return [code, Order.FUNCTION_CALL];
    };
});

const setNeoPixelColor = defineBlock(
    {
        type: 'mpblockly_set_neopixel_color',
        inputs: {
            NUM: {
                shadow: {
                    type: 'math_number',
                    fields: {
                        NUM: 1,
                    },
                },
            },
            COLOUR: {
                shadow: {
                    type: 'colour_picker',
                    fields: {
                        COLOUR: 'ff0000',
                    },
                }
            }
        }
    },
    (type) => {
        Blockly.defineBlocksWithJsonArray([
            {
                type,
                message0: '%1 番目のカラーLEDの色を %2 に設定する',
                args0: [
                    {
                        type: 'input_value',
                        name: 'NUM',
                    },
                    {
                        type: 'input_value',
                        name: 'COLOUR',
                    },
                ],
                previousStatement: null,
                nextStatement: null,
                style: 'colour_blocks',
            },
        ]);

        pythonGenerator.forBlock[type] = (block, generator) => {
            const num = generator.valueToCode(block, 'NUM', Order.ATOMIC);
            const zeroBasedNum = Number(num) - 1; // Convert to zero-based index
            const colour = generator.valueToCode(block, 'COLOUR', Order.ATOMIC); // "'#~~~~~~'" の形になる 中身だけ取り出せないっぽいからシングルクォートを自分で除去する必要ある あとで
            generator.provideFunction_('mpblockly_import_neopixel', 'import neopixel');
            generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
            generator.provideFunction_('mpblockly_neopixel_instance', 'np = neopixel.NeoPixel(machine.Pin(22), 3)');
            return `np[${zeroBasedNum}] = (${hexToRgbInstr(colour)})\n`;
        };
    });

const setAllNeoPixelColor = defineBlock(
    {
        type: 'mpblockly_set_all_neopixel_color',
        inputs: {
            COLOUR: {
                shadow: {
                    type: 'colour_picker',
                    fields: {
                        COLOUR: 'ff0000',
                    },
                }
            }
        }
    },
    (type) => {
        Blockly.defineBlocksWithJsonArray([
            {
                type,
                message0: '全てのカラーLEDの色を %1 に設定する',
                args0: [
                    {
                        type: 'input_value',
                        name: 'COLOUR',
                    },
                ],
                previousStatement: null,
                nextStatement: null,
                style: 'colour_blocks',
            },
        ]);

        pythonGenerator.forBlock[type] = (block, generator) => {
            const colour = generator.valueToCode(block, 'COLOUR', Order.ATOMIC);
            generator.provideFunction_('mpblockly_import_neopixel', 'import neopixel');
            generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
            generator.provideFunction_('mpblockly_neopixel_instance', 'np = neopixel.NeoPixel(machine.Pin(22), 3)');
            return `np.fill((${hexToRgbInstr(colour)}))\n`;
        };
    });

const showNeoPixel = defineBlock({ type: 'mpblockly_show_neopixel' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: 'カラーLED群に設定を書き込む',
            previousStatement: null,
            nextStatement: null,
            style: 'colour_blocks',
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        generator.provideFunction_('mpblockly_import_neopixel', 'import neopixel');
        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
        generator.provideFunction_('mpblockly_neopixel_instance', 'np = neopixel.NeoPixel(machine.Pin(22), 3)');
        return `np.write()\n`;
    };
});

const allOffNeoPixel = defineBlock({ type: 'mpblockly_all_off_neopixel' }, (type) => {
    Blockly.defineBlocksWithJsonArray([
        {
            type,
            message0: '全てのカラーLEDを消灯する',
            previousStatement: null,
            nextStatement: null,
            style: 'colour_blocks',
        },
    ]);

    pythonGenerator.forBlock[type] = (block, generator) => {
        generator.provideFunction_('mpblockly_import_neopixel', 'import neopixel');
        generator.provideFunction_('mpblockly_import_pin', 'from machine import Pin',);
        generator.provideFunction_('mpblockly_neopixel_instance', 'np = neopixel.NeoPixel(machine.Pin(22), 3)');
        return `np.fill((0, 0, 0))\nnp.write()\n`;
    };
});

export default defineCategory({ name: 'カラーLED' }, [
    colourRgbBlock,
    colourRandomBlock,
    setNeoPixelColor,
    setAllNeoPixelColor,
    showNeoPixel,
    allOffNeoPixel,
]);
