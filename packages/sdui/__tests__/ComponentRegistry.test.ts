import React from 'react';
import { View } from 'react-native';
import { ComponentRegistry } from '../src/ComponentRegistry';

// Mock component
const MockComponent = () => React.createElement(View);

describe('ComponentRegistry', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  describe('register', () => {
    it('registers_component_successfully', () => {
      ComponentRegistry.register('test', MockComponent);

      expect(ComponentRegistry.has('test')).toBe(true);
    });

    it('registers_withDefaultProps', () => {
      ComponentRegistry.register('test', MockComponent, { foo: 'bar' });

      const registered = ComponentRegistry.get('test');
      expect(registered?.defaultProps).toEqual({ foo: 'bar' });
    });

    it('normalizes_typeToLowercase', () => {
      ComponentRegistry.register('TestComponent', MockComponent);

      expect(ComponentRegistry.has('testcomponent')).toBe(true);
      expect(ComponentRegistry.has('TESTCOMPONENT')).toBe(true);
    });
  });

  describe('get', () => {
    it('returns_registeredComponent', () => {
      ComponentRegistry.register('test', MockComponent);

      const registered = ComponentRegistry.get('test');
      expect(registered?.component).toBe(MockComponent);
    });

    it('returns_undefined_forUnregistered', () => {
      const registered = ComponentRegistry.get('nonexistent');
      expect(registered).toBeUndefined();
    });

    it('isCaseInsensitive', () => {
      ComponentRegistry.register('MyComponent', MockComponent);

      expect(ComponentRegistry.get('mycomponent')).toBeDefined();
      expect(ComponentRegistry.get('MYCOMPONENT')).toBeDefined();
      expect(ComponentRegistry.get('MyComponent')).toBeDefined();
    });
  });

  describe('has', () => {
    it('returns_true_forRegistered', () => {
      ComponentRegistry.register('test', MockComponent);
      expect(ComponentRegistry.has('test')).toBe(true);
    });

    it('returns_false_forUnregistered', () => {
      expect(ComponentRegistry.has('nonexistent')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('removes_component', () => {
      ComponentRegistry.register('test', MockComponent);
      ComponentRegistry.unregister('test');

      expect(ComponentRegistry.has('test')).toBe(false);
    });
  });

  describe('getRegisteredTypes', () => {
    it('returns_allRegisteredTypes', () => {
      ComponentRegistry.register('text', MockComponent);
      ComponentRegistry.register('button', MockComponent);
      ComponentRegistry.register('card', MockComponent);

      const types = ComponentRegistry.getRegisteredTypes();
      expect(types).toContain('text');
      expect(types).toContain('button');
      expect(types).toContain('card');
      expect(types).toHaveLength(3);
    });
  });

  describe('clear', () => {
    it('removes_allComponents', () => {
      ComponentRegistry.register('a', MockComponent);
      ComponentRegistry.register('b', MockComponent);
      ComponentRegistry.clear();

      expect(ComponentRegistry.getRegisteredTypes()).toHaveLength(0);
    });
  });
});
