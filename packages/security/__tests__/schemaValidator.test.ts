import { validateSchema, SchemaValidator } from '../src/validation/schemaValidator';

describe('validateSchema', () => {
  describe('basic validation', () => {
    it('validates_valid_schema', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: 'Hello' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects_non_object_schema', () => {
      const result = validateSchema('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'INVALID_SCHEMA' })
      );
    });

    it('rejects_null_schema', () => {
      const result = validateSchema(null);
      expect(result.valid).toBe(false);
    });

    it('rejects_schema_without_screen_type', () => {
      const schema = {
        type: 'view',
        children: [],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'INVALID_ROOT_TYPE' })
      );
    });

    it('rejects_schema_without_children_array', () => {
      const schema = {
        type: 'screen',
        children: 'not an array',
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'INVALID_CHILDREN' })
      );
    });
  });

  describe('node validation', () => {
    it('validates_nested_children', () => {
      const schema = {
        type: 'screen',
        children: [
          {
            type: 'card',
            children: [
              { type: 'text', props: { content: 'Hello' } },
            ],
          },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
    });

    it('rejects_node_without_type', () => {
      const schema = {
        type: 'screen',
        children: [
          { props: { content: 'Hello' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'MISSING_TYPE' })
      );
    });

    it('rejects_unknown_component_type', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'malicious-component', props: {} },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'UNKNOWN_TYPE' })
      );
    });
  });

  describe('dangerous props detection', () => {
    it('detects_javascript_in_props', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: 'javascript:alert(1)' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'DANGEROUS_PROP_VALUE' })
      );
    });

    it('detects_script_tags_in_props', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: '<script>evil()</script>' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'DANGEROUS_PROP_VALUE' })
      );
    });

    it('detects_eval_in_props', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: 'eval("evil code")' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
    });

    it('detects_prototype_pollution', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: '__proto__.polluted' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
    });

    it('warns_on_event_handler_props', () => {
      const schema = {
        type: 'screen',
        children: [
          { type: 'button', props: { onCustomEvent: 'handler' } },
        ],
      };

      const result = validateSchema(schema);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({ code: 'EVENT_HANDLER_PROP' })
      );
    });
  });

  describe('action validation', () => {
    it('validates_valid_actions', () => {
      const schema = {
        type: 'screen',
        children: [
          {
            type: 'button',
            actions: {
              onPress: { type: 'navigate', payload: { to: '/home' } },
            },
          },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
    });

    it('rejects_action_without_type', () => {
      const schema = {
        type: 'screen',
        children: [
          {
            type: 'button',
            actions: {
              onPress: { payload: { to: '/home' } },
            },
          },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'MISSING_ACTION_TYPE' })
      );
    });

    it('rejects_unknown_action_type', () => {
      const schema = {
        type: 'screen',
        children: [
          {
            type: 'button',
            actions: {
              onPress: { type: 'execute_arbitrary_code' },
            },
          },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'UNKNOWN_ACTION_TYPE' })
      );
    });
  });

  describe('depth and size limits', () => {
    it('rejects_schema_exceeding_max_depth', () => {
      // Create deeply nested schema
      let current: Record<string, unknown> = { type: 'text' };
      for (let i = 0; i < 25; i++) {
        current = { type: 'container', children: [current] };
      }

      const schema = {
        type: 'screen',
        children: [current],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'MAX_DEPTH_EXCEEDED' })
      );
    });

    it('rejects_schema_exceeding_max_children', () => {
      const children = Array.from({ length: 150 }, (_, i) => ({
        type: 'text',
        props: { content: `Item ${i}` },
      }));

      const schema = {
        type: 'screen',
        children: [
          { type: 'container', children },
        ],
      };

      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: 'MAX_CHILDREN_EXCEEDED' })
      );
    });
  });
});

describe('SchemaValidator', () => {
  it('accepts_custom_allowed_types', () => {
    const validator = new SchemaValidator({
      allowedTypes: ['text', 'custom-component'],
    });

    const schema = {
      type: 'screen',
      children: [
        { type: 'custom-component', props: {} },
      ],
    };

    const result = validator.validate(schema);
    expect(result.valid).toBe(true);
  });

  it('rejects_custom_actions_when_disabled', () => {
    const validator = new SchemaValidator({
      allowCustomActions: false,
    });

    const schema = {
      type: 'screen',
      children: [
        {
          type: 'button',
          actions: {
            onPress: { type: 'custom', payload: {} },
          },
        },
      ],
    };

    const result = validator.validate(schema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: 'CUSTOM_ACTION_NOT_ALLOWED' })
    );
  });

  it('accepts_custom_max_depth', () => {
    const validator = new SchemaValidator({
      maxDepth: 5,
    });

    // Create 6 levels deep
    let current: Record<string, unknown> = { type: 'text' };
    for (let i = 0; i < 6; i++) {
      current = { type: 'container', children: [current] };
    }

    const schema = {
      type: 'screen',
      children: [current],
    };

    const result = validator.validate(schema);
    expect(result.valid).toBe(false);
  });

  it('can_disable_dangerous_prop_blocking', () => {
    const validator = new SchemaValidator({
      blockDangerousProps: false,
    });

    const schema = {
      type: 'screen',
      children: [
        { type: 'text', props: { content: 'javascript:alert(1)' } },
      ],
    };

    const result = validator.validate(schema);
    expect(result.valid).toBe(true);
  });
});
