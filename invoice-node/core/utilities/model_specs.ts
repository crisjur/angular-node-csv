import Sequelize, { ModelAttributeColumnOptions } from "sequelize";

export default {
  generic_string: (required = false, length = 255, unique = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    unique: unique,
    validate: { len: [0, length], ...required && { notEmpty: required } },
  }), reference: (): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [1, 64], notEmpty: true },
  }), number: (required = false, defaultValue?: number): ModelAttributeColumnOptions => ({
    type: Sequelize.INTEGER,
    allowNull: !required,
    defaultValue,
  }), email: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: { isEmail: true },
  }), timestamp: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.DATE,
    allowNull: !required,
  }), date: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.DATEONLY,
    allowNull: !required,
  }), boolean: (required = false, defaultValue?: boolean): ModelAttributeColumnOptions => ({
    type: Sequelize.BOOLEAN,
    allowNull: !required,
    defaultValue,
  }), phone: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: { notEmpty: required },
  }), url: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: { isUrl: true, notEmpty: required },
  }), ip_address: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: { isIP: true, notEmpty: required },
  }), currency: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.STRING,
    allowNull: !required,
    validate: { len: [3, 3], notEmpty: required },
  }), currency_amount: (required = false, defaultValue?: number): ModelAttributeColumnOptions => ({
    type: Sequelize.DECIMAL(64, 0),
    allowNull: !required,
    defaultValue,
  }), foreign_key: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.INTEGER,
    allowNull: !required,
  }), primary_key: (): ModelAttributeColumnOptions => ({
    type: Sequelize.INTEGER,
    primaryKey: true,
  }), text: (required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.TEXT,
    allowNull: !required,
  }), decimal: (required = false, m = 36, d = 2): ModelAttributeColumnOptions => ({
    type: Sequelize.DECIMAL(m, d),
    allowNull: !required,
  }), enum: (values: { [index: string]: string } = {}, required = false): ModelAttributeColumnOptions => ({
    type: Sequelize.DataTypes.ENUM(...Object.values(values)),
    allowNull: !required,
  }),
};