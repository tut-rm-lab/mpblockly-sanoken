import { sleepSeconds, toggleLed } from './blocks';
import { block, category, categoryToolbox } from './toolbox';

export default categoryToolbox([
  category({ name: 'カテゴリ' }, [
    toggleLed,
    sleepSeconds,
    block({ type: 'controls_whileUntil' }),
    block({ type: 'logic_boolean' }),
  ]),
]);
