const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("DataRegistry", function () {
  // Fixture for deploying contracts
  async function deployDataRegistryFixture() {
    const [owner, patient1, patient2, oracle, unauthorized] = await ethers.getSigners();

    const DataRegistry = await ethers.getContractFactory("DataRegistry");
    const dataRegistry = await DataRegistry.deploy();
    await dataRegistry.waitForDeployment();

    return { dataRegistry, owner, patient1, patient2, oracle, unauthorized };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { dataRegistry, owner } = await loadFixture(deployDataRegistryFixture);
      expect(await dataRegistry.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero records", async function () {
      const { dataRegistry } = await loadFixture(deployDataRegistryFixture);
      expect(await dataRegistry.recordCount()).to.equal(0);
    });
  });

  describe("Health Data Submission", function () {
    it("Should submit encrypted health data successfully", async function () {
      const { dataRegistry, patient1 } = await loadFixture(deployDataRegistryFixture);

      // Mock encrypted inputs (in production, use fhevmjs)
      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      const tx = await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await expect(tx)
        .to.emit(dataRegistry, "RecordSubmitted")
        .withArgs(0, patient1.address, await ethers.provider.getBlock("latest").then(b => b.timestamp));

      expect(await dataRegistry.recordCount()).to.equal(1);
    });

    it("Should track patient records correctly", async function () {
      const { dataRegistry, patient1 } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      // Submit first record
      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      // Submit second record
      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      const patientRecords = await dataRegistry.getPatientRecords(patient1.address);
      expect(patientRecords.length).to.equal(2);
      expect(patientRecords[0]).to.equal(0);
      expect(patientRecords[1]).to.equal(1);
    });

    it("Should allow multiple patients to submit data", async function () {
      const { dataRegistry, patient1, patient2 } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await dataRegistry.connect(patient2).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      expect(await dataRegistry.recordCount()).to.equal(2);
      
      const patient1Records = await dataRegistry.getPatientRecords(patient1.address);
      const patient2Records = await dataRegistry.getPatientRecords(patient2.address);
      
      expect(patient1Records.length).to.equal(1);
      expect(patient2Records.length).to.equal(1);
    });
  });

  describe("Record Revocation", function () {
    it("Should allow patient to revoke their own record", async function () {
      const { dataRegistry, patient1 } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      const tx = await dataRegistry.connect(patient1).revokeRecord(0);
      
      await expect(tx)
        .to.emit(dataRegistry, "RecordRevoked")
        .withArgs(0, patient1.address);

      expect(await dataRegistry.isRecordActive(0)).to.equal(false);
    });

    it("Should prevent unauthorized revocation", async function () {
      const { dataRegistry, patient1, unauthorized } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await expect(
        dataRegistry.connect(unauthorized).revokeRecord(0)
      ).to.be.revertedWith("Not record owner");
    });

    it("Should prevent double revocation", async function () {
      const { dataRegistry, patient1 } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await dataRegistry.connect(patient1).revokeRecord(0);

      await expect(
        dataRegistry.connect(patient1).revokeRecord(0)
      ).to.be.revertedWith("Record already revoked");
    });
  });

  describe("Oracle Authorization", function () {
    it("Should allow owner to authorize oracle", async function () {
      const { dataRegistry, owner, oracle } = await loadFixture(deployDataRegistryFixture);

      const tx = await dataRegistry.connect(owner).authorizeOracle(oracle.address);
      
      await expect(tx)
        .to.emit(dataRegistry, "OracleAuthorized")
        .withArgs(oracle.address);

      expect(await dataRegistry.authorizedOracles(oracle.address)).to.equal(true);
    });

    it("Should prevent non-owner from authorizing oracle", async function () {
      const { dataRegistry, unauthorized, oracle } = await loadFixture(deployDataRegistryFixture);

      await expect(
        dataRegistry.connect(unauthorized).authorizeOracle(oracle.address)
      ).to.be.revertedWith("Only owner");
    });

    it("Should prevent authorizing zero address", async function () {
      const { dataRegistry, owner } = await loadFixture(deployDataRegistryFixture);

      await expect(
        dataRegistry.connect(owner).authorizeOracle(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid oracle address");
    });

    it("Should allow owner to revoke oracle", async function () {
      const { dataRegistry, owner, oracle } = await loadFixture(deployDataRegistryFixture);

      await dataRegistry.connect(owner).authorizeOracle(oracle.address);
      
      const tx = await dataRegistry.connect(owner).revokeOracle(oracle.address);
      
      await expect(tx)
        .to.emit(dataRegistry, "OracleRevoked")
        .withArgs(oracle.address);

      expect(await dataRegistry.authorizedOracles(oracle.address)).to.equal(false);
    });
  });

  describe("Access Control", function () {
    it("Should allow patient to access their own records", async function () {
      const { dataRegistry, patient1 } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      const record = await dataRegistry.connect(patient1).getRecord(0);
      expect(record.patient).to.equal(patient1.address);
    });

    it("Should allow authorized oracle to access records", async function () {
      const { dataRegistry, owner, patient1, oracle } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await dataRegistry.connect(owner).authorizeOracle(oracle.address);

      const record = await dataRegistry.connect(oracle).getRecord(0);
      expect(record.patient).to.equal(patient1.address);
    });

    it("Should prevent unauthorized access to records", async function () {
      const { dataRegistry, patient1, unauthorized } = await loadFixture(deployDataRegistryFixture);

      const encryptedAge = ethers.zeroPadValue("0x01", 32);
      const encryptedDiagnosis = ethers.zeroPadValue("0x02", 32);
      const encryptedOutcome = ethers.zeroPadValue("0x03", 32);
      const encryptedBiomarker = ethers.zeroPadValue("0x04", 32);
      const inputProof = ethers.zeroPadValue("0x00", 64);

      await dataRegistry.connect(patient1).submitHealthData(
        encryptedAge,
        encryptedDiagnosis,
        encryptedOutcome,
        encryptedBiomarker,
        inputProof
      );

      await expect(
        dataRegistry.connect(unauthorized).getRecord(0)
      ).to.be.revertedWith("Not authorized");
    });
  });
});