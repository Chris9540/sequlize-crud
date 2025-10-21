const {
  Model,
  Sequelize,
  DataTypes: { INTEGER, STRING, BOOLEAN, FLOAT, VIRTUAL, TEXT },
} = require("sequelize");
const { ValidationSchema } = require("./dist/sequelize-server");

class Test extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        version: {
          type: INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        name: {
          type: STRING,
          allowNull: false,
        },
        status: {
          type: STRING,
          allowNull: false,
          defaultValue: "editable",
        },
        active: {
          type: BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        summary: {
          type: TEXT,
          allowNull: false,
        },
        whatDoesSuccessLookLike: {
          type: TEXT,
          allowNull: false,
        },
        budget: {
          type: FLOAT,
          allowNull: false,
        },
        creative: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        managementMargin: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0.1,
        },
        managementFee: {
          type: VIRTUAL,
          get() {
            return parseFloat(this.budget * this.managementMargin).toFixed(2);
          },
        },
        marginGoogleSearch: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginYoutube: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginPerformanceMax: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginGoogleDisplayNetwork: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginDemandGen: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginMetaSuite: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginFacebook: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginInstagram: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginThreads: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginLinkedin: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginPinterest: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginQuora: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginReddit: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginSnapchat: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginX: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginTiktok: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginBing: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginDirectMedia: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginDigitalOutOfHome: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginOutOfHome: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginDisplay: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginVideo: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginConnectedTV: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginGeoFence: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginAudioPodcast: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginAudioStreaming: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginInteractive: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        marginNative: {
          type: FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        tableName: "test",
        sequelize,
        indexes: [],
      }
    );
  }
}

(async function () {
  const sequelize = new Sequelize("akero", "postgres", "postgres", {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  });

  const model = Test.init(sequelize);

  await sequelize.sync({ alter: true });

  const schema = ValidationSchema.POST(model.tableAttributes);
  console.log(schema);
})();
