executar comando:
npx sequelize-cli migration:generate --name
--mapeado com o script m:create

Vai gerar um arquivom o timestamp + o nome selecionado.
Nesse arquivo, configurar as informações da tabela seguindo o padrão abaixo (exemplo de um pronto no fim do arquivo).
/////
const { DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: (queryInterface) => {
    return queryInterface.createTable('<SUA TABELA AQUI>', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    });
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  down: (queryInterface, Sequelize) => {}
};


Então criar o modelo. 
E executar a migration com: 
npx sequelize-cli db:migrate
--no projeto mapeado como migrate

Para desfazer a ultima migration:
--npx sequelize db:migrate:undo



/*exemplo pronto*/

/////migration
'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: (queryInterface) => {
    return queryInterface.createTable('databridgebancos', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      codigo: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      criadoem: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      atualizadoem: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('databridgebancos');
  }
};


/////modelo
import { DataTypes, InferAttributes, CreationOptional, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class DataBridgeBancos extends Model<InferAttributes<DataBridgeBancos>, InferCreationAttributes<DataBridgeBancos>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare codigo: number;
  declare criadoem: CreationOptional<Date>;
  declare atualizadoem: CreationOptional<Date>;
}

export function initModel(connection: Sequelize) {
  DataBridgeBancos.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    criadoem: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    atualizadoem: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'databridgebancos',
    timestamps: true,
    sequelize: connection,
    createdAt: 'criadoem',
    updatedAt: 'atualizadoem'
  });
}
