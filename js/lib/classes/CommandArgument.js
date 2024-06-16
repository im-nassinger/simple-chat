import { cleanString } from '../utils.js';

const CommandArgumentTypes = {
    string : 'string',
    number : 'number',
    boolean: 'boolean'
};

const BooleanAnswers = {
    true : [ 'sim', 's', 'yes', 'y', 'true' ],
    false: [ 'nao', 'n', 'no', 'false' ]
};

export default class CommandArgument {
    constructor(argumentOptions) {
        this.name = argumentOptions.name;
        this.key = argumentOptions.key;
        this.type = CommandArgumentTypes[argumentOptions.type];
        this.description = argumentOptions.description;
        this.optional = argumentOptions.optional || false;
        this.full = argumentOptions.full || false;
        this.checkResult = { valid: null, reason: null };
        this.empty = false;
    }

    check(argText) {
        this.empty = !argText;

        if (this.empty) {
            if (this.optional) {
                return this.isValidBecause('é opcional.');
            } else {
                return this.isWrongBecause('é obrigatório.');
            }
        }
        
        if (this.needsToBe('string')) {
            return this.isValidBecause('não está vazio.');
        }

        if (this.needsToBe('number')) {
            const isActuallyNumber = CommandArgument.getNumber(argText) !== null;

            if (isActuallyNumber) {
                return this.isValidBecause('é mesmo um número.');
            } else {
                return this.isWrongBecause('deve ser um número.');
            }
        }
        
        if (this.needsToBe('boolean')) {
            const isActuallyBoolean = CommandArgument.getBoolean(argText) !== null;

            if (isActuallyBoolean) {
                return this.isValidBecause('é mesmo sim ou não.');
            } else {
                return this.isWrongBecause('deve ser sim ou não.');
            }
        }
    }

    isValidBecause(reason) {
        return this.checkResult = { valid: true, reason };
    }

    isWrongBecause(reason) {
        return this.checkResult = { valid: false, reason };
    }

    needsToBe(type) {
        return this.type === CommandArgumentTypes[type];
    }

    static getString(argText) {
        return argText.length ? String(argText) : null;
    }

    static getNumber(argText) {
        return !isNaN(argText) ? Number(argText) : null;
    }

    static getBoolean(argText) {
        const cleanContent = cleanString(argText);

        if (BooleanAnswers.true.includes(cleanContent)) return true;
        if (BooleanAnswers.false.includes(cleanContent)) return false;

        return null;
    }

    parse(argText) {
        if (this.needsToBe('string')) return CommandArgument.getString(argText);
        if (this.needsToBe('number')) return CommandArgument.getNumber(argText);
        if (this.needsToBe('boolean')) return CommandArgument.getBoolean(argText);
    }
}