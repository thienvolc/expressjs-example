export const selectFieldsFromObject = (object, fields) => {
    return Object.fromEntries(fields.map((field) => [field, object[field]]));
};

export class StaticMethodDecorator {
    constructor(decorator) {
        this.decorator = decorator;
    }

    decorateAllStaticMethods(Class) {
        const classStaticMethods = this.getStaticMethodsOfClass(Class);
        return this.applyDecoratorToMethods(Class, classStaticMethods);
    }

    applyDecoratorToMethods(Class, methods) {
        const WrappedClass = class {};
        methods.forEach((method) => {
            WrappedClass[method] = this.decorator(Class[method], method);
        });
        return WrappedClass;
    }

    getStaticMethodsOfClass(Class) {
        return Object.getOwnPropertyNames(Class).filter((property) =>
            this.isStaticMethod(Class, property)
        );
    }

    isStaticMethod(Class, method) {
        return typeof Class[method] === 'function' && method !== 'prototype' && method !== 'constructor';
    }
}
