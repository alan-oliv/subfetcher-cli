"use strict";

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.version('0.0.1').command('list [directory]').description('List files and folders').option('-a, --all', 'List all files and folders').option('-l, --long', '').action();

_commander.default.parse(process.argv);
