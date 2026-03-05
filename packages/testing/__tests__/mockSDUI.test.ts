import {
  mockSDUISchema,
  mockTextNode,
  mockButtonNode,
  mockCardNode,
  mockListNode,
  mockImageNode,
  mockNavigateAction,
  mockApiAction,
  mockProfileScreenSchema,
} from '../src/mocks/mockSDUI';

describe('mockSDUI', () => {
  describe('mockSDUISchema', () => {
    it('creates_emptyScreenSchema_byDefault', () => {
      const schema = mockSDUISchema();

      expect(schema.type).toBe('screen');
      expect(schema.id).toBe('mock-screen');
      expect(schema.children).toEqual([]);
    });

    it('accepts_overrides', () => {
      const schema = mockSDUISchema({
        id: 'custom-screen',
        children: [mockTextNode('Hello')],
      });

      expect(schema.id).toBe('custom-screen');
      expect(schema.children).toHaveLength(1);
    });
  });

  describe('mockTextNode', () => {
    it('creates_textNode_withContent', () => {
      const node = mockTextNode('Hello World');

      expect(node.type).toBe('text');
      expect(node.props?.content).toBe('Hello World');
      expect(node.props?.variant).toBe('body');
    });

    it('accepts_customProps', () => {
      const node = mockTextNode('Title', { variant: 'title', color: 'primary' });

      expect(node.props?.variant).toBe('title');
      expect(node.props?.color).toBe('primary');
    });
  });

  describe('mockButtonNode', () => {
    it('creates_buttonNode_withLabel', () => {
      const node = mockButtonNode('Click Me');

      expect(node.type).toBe('button');
      expect(node.props?.label).toBe('Click Me');
      expect(node.props?.variant).toBe('primary');
    });

    it('accepts_action', () => {
      const action = mockNavigateAction('/home');
      const node = mockButtonNode('Go Home', action);

      expect(node.actions?.onPress).toEqual(action);
    });
  });

  describe('mockCardNode', () => {
    it('creates_cardNode_withTitle', () => {
      const node = mockCardNode('My Card');

      expect(node.type).toBe('card');
      expect(node.props?.title).toBe('My Card');
    });

    it('accepts_children', () => {
      const children = [mockTextNode('Child text')];
      const node = mockCardNode('Card', children);

      expect(node.children).toEqual(children);
    });
  });

  describe('mockListNode', () => {
    it('creates_verticalList_byDefault', () => {
      const items = [mockTextNode('Item 1'), mockTextNode('Item 2')];
      const node = mockListNode(items);

      expect(node.type).toBe('list');
      expect(node.props?.direction).toBe('vertical');
      expect(node.children).toEqual(items);
    });

    it('accepts_customDirection', () => {
      const node = mockListNode([], { direction: 'horizontal' });

      expect(node.props?.direction).toBe('horizontal');
    });
  });

  describe('mockImageNode', () => {
    it('creates_imageNode_withUri', () => {
      const node = mockImageNode('https://example.com/image.png');

      expect(node.type).toBe('image');
      expect(node.props?.uri).toBe('https://example.com/image.png');
      expect(node.props?.variant).toBe('default');
    });

    it('accepts_avatarVariant', () => {
      const node = mockImageNode('https://example.com/avatar.png', { variant: 'avatar' });

      expect(node.props?.variant).toBe('avatar');
    });
  });

  describe('mockNavigateAction', () => {
    it('creates_navigateAction', () => {
      const action = mockNavigateAction('/profile');

      expect(action.type).toBe('navigate');
      expect(action.payload?.to).toBe('/profile');
    });

    it('accepts_params', () => {
      const action = mockNavigateAction('/profile', { id: '123' });

      expect(action.payload?.params).toEqual({ id: '123' });
    });
  });

  describe('mockApiAction', () => {
    it('creates_getAction_byDefault', () => {
      const action = mockApiAction('/api/users');

      expect(action.type).toBe('api');
      expect(action.payload?.endpoint).toBe('/api/users');
      expect(action.payload?.method).toBe('GET');
    });

    it('accepts_customMethod_andBody', () => {
      const action = mockApiAction('/api/users', 'POST', { name: 'John' });

      expect(action.payload?.method).toBe('POST');
      expect(action.payload?.body).toEqual({ name: 'John' });
    });
  });

  describe('mockProfileScreenSchema', () => {
    it('creates_completeProfileScreen', () => {
      const schema = mockProfileScreenSchema('johndoe');

      expect(schema.type).toBe('screen');
      expect(schema.id).toBe('profile-screen');
      expect(schema.children.length).toBeGreaterThan(0);

      // Should have avatar image
      const avatar = schema.children.find(
        (c) => c.type === 'image' && c.props?.variant === 'avatar'
      );
      expect(avatar).toBeDefined();

      // Should have username text
      const username = schema.children.find(
        (c) => c.type === 'text' && c.props?.content === 'johndoe'
      );
      expect(username).toBeDefined();

      // Should have list with cards
      const list = schema.children.find((c) => c.type === 'list');
      expect(list).toBeDefined();
      expect(list?.children?.length).toBeGreaterThan(0);
    });

    it('uses_defaultUsername_whenNotProvided', () => {
      const schema = mockProfileScreenSchema();

      const username = schema.children.find(
        (c) => c.type === 'text' && c.props?.content === 'testuser'
      );
      expect(username).toBeDefined();
    });
  });
});
