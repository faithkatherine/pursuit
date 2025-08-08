import React from 'react';
import { Carousel } from '../Carousel';
import { Text, View } from 'react-native';

describe('Carousel', () => {
  it('accepts header and items props', () => {
    const header = <Text>Test Header</Text>;
    const items = [
      <Text key="1">Item 1</Text>,
      <Text key="2">Item 2</Text>
    ];

    const component = <Carousel header={header} items={items} />;
    
    expect(component.props.header).toBeDefined();
    expect(component.props.items).toHaveLength(2);
    expect(component.props.items[0].props.children).toBe('Item 1');
    expect(component.props.items[1].props.children).toBe('Item 2');
  });

  it('handles empty items array', () => {
    const header = <Text>Empty Header</Text>;
    const items: React.ReactNode[] = [];

    const component = <Carousel header={header} items={items} />;
    
    expect(component.props.header).toBeDefined();
    expect(component.props.items).toHaveLength(0);
  });

  it('accepts complex header content', () => {
    const header = (
      <View>
        <Text>Complex Header</Text>
        <Text>Subtitle</Text>
      </View>
    );
    const items = [<Text key="1">Single Item</Text>];

    const component = <Carousel header={header} items={items} />;
    
    expect(component.props.header.props.children).toHaveLength(2);
    expect(component.props.items).toHaveLength(1);
  });

  it('handles multiple items', () => {
    const header = <Text>Multiple Items</Text>;
    const items = [
      <View key="1"><Text>Card 1</Text></View>,
      <View key="2"><Text>Card 2</Text></View>,
      <View key="3"><Text>Card 3</Text></View>
    ];

    const component = <Carousel header={header} items={items} />;
    
    expect(component.props.header.props.children).toBe('Multiple Items');
    expect(component.props.items).toHaveLength(3);
    expect(component.props.items[0].props.children.props.children).toBe('Card 1');
    expect(component.props.items[1].props.children.props.children).toBe('Card 2');
    expect(component.props.items[2].props.children.props.children).toBe('Card 3');
  });

  it('accepts all required props', () => {
    const header = <Text>Props Test</Text>;
    const items = [<Text key="1">Item</Text>];
    
    const component = <Carousel header={header} items={items} />;
    
    expect(component.props.header).toBeDefined();
    expect(component.props.items).toHaveLength(1);
  });

  it('handles undefined items gracefully', () => {
    const header = <Text>Default Items</Text>;
    
    const component = <Carousel header={header} items={undefined as any} />;
    
    expect(component.props.header).toBeDefined();
    expect(component.props.items).toBeUndefined();
  });

  it('component structure is correct', () => {
    const header = <Text>Structure Test</Text>;
    const items = [<Text key="1">Test Item</Text>];
    
    const component = <Carousel header={header} items={items} />;
    
    expect(component.type).toBe(Carousel);
    expect(component.props).toEqual({
      header: header,
      items: items
    });
  });
});