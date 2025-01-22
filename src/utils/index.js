export const selectFieldsFromObject = (object, fields) => 
    Object.fromEntries(fields.map((field) => [field, object[field]]));

export class StaticMethodDecorator {
    constructor(decorator) {
        this.decorator = decorator;
    }

    decorateAllStaticMethods = (Class) => {
        const classStaticMethods = this.getStaticMethodsOfClass(Class);
        return this.applyDecoratorToMethods(Class, classStaticMethods);
    };

    applyDecoratorToMethods = (Class, methods) => {
        const WrappedClass = class {};
        methods.forEach((method) => {
            WrappedClass[method] = this.decorator(Class[method], method);
        });
        return WrappedClass;
    };

    getStaticMethodsOfClass = (Class) => 
        Object.getOwnPropertyNames(Class).filter((property) =>
            this.isStaticMethod(Class, property)
        );

    isStaticMethod = (Class, method) => 
        typeof Class[method] === 'function' && method !== 'prototype' && method !== 'constructor';
}

import { Types } from 'mongoose';
export const toMongooseObjectId = (id) => new Types.ObjectId(id);
