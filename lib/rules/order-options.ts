// ------------------------------------------------------------------------------
// Imports
// ------------------------------------------------------------------------------

import {
  createRule,
  configOptionKeys,
  configFilenames,
  getFilename,
} from "../util";
import {
  TSESTree,
  AST_NODE_TYPES,
} from "@typescript-eslint/experimental-utils";

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

type OrderType<
  T extends keyof typeof configOptionKeys
> = typeof configOptionKeys[T][number][];

type Order = OrderType<"eslint"> | OrderType<"stylelint">;

type FilenamesType<T extends keyof typeof configFilenames> =
  | string[]
  | typeof configFilenames[T][number][];

type Filenames = FilenamesType<"eslint"> | FilenamesType<"stylelint">;

const setOrder = (key: keyof typeof configOptionKeys) => [
  ...configOptionKeys[key],
];

const setFilenames = (key: keyof typeof configFilenames) => [
  ...configFilenames[key],
];

/**
 * Get properties from config file
 */
const getProperties = (node: TSESTree.ObjectExpression) => {
  const properties = [];

  for (const property of node.properties) {
    if (property.type !== AST_NODE_TYPES.Property) continue;
    if (property.key.type !== AST_NODE_TYPES.Identifier) continue;

    properties.push(property);
  }

  return { properties };
};

/**
 * Get override item if match param's filename and override item's filename
 */
const getOverrideItem = (override: Options["override"], filename: string) =>
  override.find((item) => item.filenames.some((f) => f === filename));

/**
 * Get array that includes property info
 */
const getPropertiesInfo = (
  properties: ReturnType<typeof getProperties>["properties"]
) => {
  const propertiesInfo = properties.map((property, index) => {
    if (property.key.type !== AST_NODE_TYPES.Identifier) return;

    return {
      node: property,
      name: property.key.name,
      loc: property.loc,
      range: property.range,
      index,
    };
  });

  return { propertiesInfo };
};

const getExpectPropertiesOrder = (
  overrideItem: NonNullable<ReturnType<typeof getOverrideItem>>,
  properties: ReturnType<typeof getProperties>["properties"]
) => {
  type ExpectPropertyOrder = {
    name: string;
    range: TSESTree.Range;
    index: number;
  };
  const expectPropertiesOrder: ExpectPropertyOrder[] = [];
  const unexpectedProperties = [];
  const expectedProperties = [];

  for (const property of properties) {
    if (property.key.type !== AST_NODE_TYPES.Identifier) continue;

    const index = overrideItem.order.findIndex((orderItem) => {
      if (property.key.type !== AST_NODE_TYPES.Identifier) return;
      return orderItem === property.key.name;
    });

    expectPropertiesOrder.push({
      name: property.key.name,
      range: property.range,
      index,
    });

    index === -1
      ? unexpectedProperties.push({
          name: property.key.name,
          index,
        })
      : expectedProperties.push({
          name: property.key.name,
          index,
        });
  }

  const expectedPropertiesLength = expectedProperties.length;

  unexpectedProperties.forEach((unexpectedProperty, index) => {
    expectPropertiesOrder.forEach((item) => {
      if (item.name === unexpectedProperty.name) {
        item.index = expectedPropertiesLength + index;
      }
    });
  });

  return {
    expectPropertiesOrder: expectPropertiesOrder.sort((a, b) => {
      return a.index - b.index;
    }),
  };
};
// ------------------------------------------------------------------------------
// Settings of createRule
// ------------------------------------------------------------------------------

type Options = {
  override: {
    order: Order;
    filenames: Filenames;
  }[];
};

const defaultOptions: [Options] = [
  {
    override: [
      {
        order: setOrder("eslint"),
        filenames: setFilenames("eslint"),
      },
      {
        order: setOrder("stylelint"),
        filenames: setFilenames("stylelint"),
      },
    ],
  },
];

type MessageIds = "orderOptions";

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export = createRule<[Options], MessageIds>({
  name: "order-options",
  meta: {
    docs: {
      description: "enforce ordering of options",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    type: "layout",
    messages: {
      orderOptions:
        "'{{ currentOptionName }}' should not here. Expect order is '{{ expectOrder }}'",
    },
    schema: [],
  },
  defaultOptions,
  create(context, [{ override }]) {
    const { filename } = getFilename(context.getFilename());

    const overrideItem = getOverrideItem(override, filename);

    if (!overrideItem) return {};

    const sourceCode = context.getSourceCode();

    return {
      'ObjectExpression[parent.parent.type="ExpressionStatement"][parent.type="AssignmentExpression"][parent.left.type="MemberExpression"][parent.right.type="ObjectExpression"]'(
        node: TSESTree.ObjectExpression
      ) {
        if (node.properties.length === 0) return;

        const { properties } = getProperties(node);

        const { propertiesInfo } = getPropertiesInfo(properties);

        const { expectPropertiesOrder } = getExpectPropertiesOrder(
          overrideItem,
          properties
        );

        return propertiesInfo.forEach((item, index) => {
          if (item === undefined) return;

          if (item.name !== expectPropertiesOrder[index].name) {
            context.report({
              node: item.node,
              loc: item.loc,
              messageId: "orderOptions",
              data: {
                currentOptionName: item.name,
                expectOrder: expectPropertiesOrder
                  .map((item) => `"${item.name}"`)
                  .join(", "),
              },
              fix(fixer) {
                const text = sourceCode.text.slice(
                  expectPropertiesOrder[index].range[0],
                  expectPropertiesOrder[index].range[1]
                );
                return fixer.replaceTextRange(item.range, text);
              },
            });
          }
        });
      },
    };
  },
});
