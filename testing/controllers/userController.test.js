const {
  setProfilePicture,
  changeName,
  resetPassword,
  applyAsExpert,
  searchForUser,
  viewUserProfile,
} = require("../../controllers/user.controller");
const userModel = require("../../models/user.model");
const uploadFile = require("../../utils/uploadImage");
const codeValidator = require("../../utils/codeValidator");

const mockUserModel = jest.mock("../../models/user.model");
console.log(mockUserModel);
jest.mock("../../utils/uploadImage");
jest.mock("../../utils/codeValidator");

let mockResponse;
let mockRequest;

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  mockRequest = {};
  jest.clearAllMocks();
});

describe("setProfilePicture", () => {
  it("should return 200 and success message when picture is uploaded", async () => {
    uploadFile.uploadImage.mockResolvedValue("http://example.com/picture.jpg");
    userModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockRequest = {
      file: {
        buffer: Buffer.from("test"),
        mimetype: "image/jpeg",
      },
      currentUser: {
        email: "test@example.com",
      },
    };
    await setProfilePicture(mockRequest, mockResponse);

    expect(uploadFile.uploadImage).toHaveBeenCalledWith(
      mockRequest.file.buffer,
      mockRequest.file.mimetype,
      "Xperts/user_pictures"
    );
    expect(userModel.updateOne).toHaveBeenCalledWith(
      { email: mockRequest.currentUser.email },
      { $set: { pfp_url: "http://example.com/picture.jpg" } }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      message:
        "picture uploaded successfully url:http://example.com/picture.jpg",
    });
  });

  it("should return error message when no file is provided", async () => {
    mockRequest = {
      currentUser: {
        email: "test@example.com",
      },
    };
    await setProfilePicture(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "file is required",
    });
  });

  it("should return error message when upload fails", async () => {
    uploadFile.uploadImage.mockRejectedValue(new Error("Upload failed"));
    mockRequest = {
      file: {
        buffer: Buffer.from("test"),
        mimetype: "image/jpeg",
      },
      currentUser: {
        email: "test@example.com",
      },
    };
    await setProfilePicture(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "photo not uploaded",
    });
  });
});

describe("changeName", () => {
  it("should return 200 and success message when name is updated", async () => {
    userModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockRequest = {
      body: {
        newName: "New Name",
      },
      currentUser: {
        email: "test@example.com",
      },
    };
    await changeName(mockRequest, mockResponse);
    expect(userModel.updateOne).toHaveBeenCalledWith(
      { email: mockRequest.currentUser.email },
      { $set: { name: mockRequest.body.newName } }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      message: "Name is updated",
    });
  });

  it("should return 403 when name length is less than 4 characters", async () => {
    mockRequest = {
      body: {
        newName: "abc",
      },
      currentUser: {
        email: "test@example.com",
      },
    };
    await changeName(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Name is too short",
    });
  });

  it("should return 500 when there is a server error", async () => {
    userModel.updateOne.mockRejectedValue(new Error("DB error"));
    mockRequest = {
      body: {
        newName: "Valid Name",
      },
      currentUser: {
        email: "test@example.com",
      },
    };
    await changeName(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Error happened please try again!!",
    });
  });
});

describe("resetPassword", () => {
  it("should return 200 and success message when password is changed", async () => {
    codeValidator.mockResolvedValue({ status: "Valid" });
    const mockUpdate = jest.fn();

    const mockRequest = {
      currentUser: {
        _id: "userId123",
        email: "example@email.com",
      },
      body: {
        code: "123456",
        newPassword: "newPassword123",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userModel.findById.mockResolvedValue({
      password: "old pass",
      updateOne: mockUpdate,
    });

    await resetPassword(mockRequest, mockResponse);

    expect(codeValidator).toHaveBeenCalledWith(
      mockRequest.body.code,
      mockRequest.currentUser.email
    );
    expect(mockUpdate).toHaveBeenCalledWith({
      $set: { password: mockRequest.body.newPassword },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      message: "password Changed",
    });
  });

  it("should return 403 and error message when the code is invalid", async () => {});
  it("should return 403 and error message when new password is same as old password", async () => {});
  it("should return 500 when there is a server error", async () => {});
});

describe("applyAsExpert", () => {
  // Tests for applyAsExpert would go here
});

describe("searchForUser", () => {
  // Tests for searchForUser would go here
});

describe("viewUserProfile", () => {
  // Tests for viewUserProfile would go here
});
