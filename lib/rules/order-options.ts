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

type OrderType<T extends keyof typeof configOptionKeys> =
  | typeof configOptionKeys[T][number][]
  | string[]
  | T;

type Order =
  | OrderType<"eslint">
  | OrderType<"stylelint">
  | OrderType<"prettier">;

type FilenamesType<T extends keyof typeof configFilenames> =
  | typeof configFilenames[T][number][]
  | string[]
  | T;

type Filenames =
  | FilenamesType<"eslint">
  | FilenamesType<"stylelint">
  | FilenamesType<"prettier">;

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
 * Get scanned option's override item
 */
const getScannedOverrideItem = (override: Options["override"]) =>
  override.map((item) => {
    let newItem: Options["override"][number] = { ...item };
    /**
     * @example
     * filenames: 'prettier'
     * => filenames: ['.prettierrc.js', 'prettier.config.js']
     */
    if (typeof item.order === "string") {
      newItem = { ...newItem, order: [...configOptionKeys[item.order]] };
    }

    /**
     * @example
     * order: 'prettier'
     * => order: ['printWidth', ...]
     */
    if (typeof item.filenames === "string") {
      newItem = { ...newItem, filenames: [...configFilenames[item.filenames]] };
    }

    return newItem;
  });

/**
 * Get override item if match param's filename and override item's filename
 */
const getOverrideItem = (override: Options["override"], filename: string) =>
  getScannedOverrideItem(override).find((item) => {
    if (typeof item.filenames === "string") return;

    return item.filenames.some((f) => f === filename);
  });

/**
 * Get array that includes property info
 */
const getPropertiesInfo = (
  properties: ReturnType<typeof getProperties>["properties"]
) => {
  const propertiesInfo = properties.map((property, index) => {
    if (property.key.type !== AST_NODE_TYPES.Identifier) return undefined;

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

    if (typeof overrideItem.order === "string") {
      overrideItem.order = [...configOptionKeys[overrideItem.order]];
    }

    const index = overrideItem.order.findIndex((orderItem) => {
      if (property.key.type !== AST_NODE_TYPES.Identifier) return undefined;
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
      {
        order: setOrder("prettier"),
        filenames: setFilenames("prettier"),
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
        "'{{ currentOptionName }}' should not be here. Expect order is [{{ expectOrder }}]",
    },
    schema: [
      {
        type: "object",
        properties: {
          override: {
            type: "array",
            items: {
              type: "object",
              properties: {
                order: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "array",
                      items: {
                        anyOf: [{ type: "string" }],
                      },
                    },
                  ],
                },
                filenames: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "array",
                      items: {
                        anyOf: [{ type: "string" }],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ],
  },
  defaultOptions,
  create(context) {
    const override =
      context.options[0]?.override !== undefined
        ? [...context.options[0].override, ...defaultOptions[0].override]
        : defaultOptions[0].override;

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
                  ...expectPropertiesOrder[index].range
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
