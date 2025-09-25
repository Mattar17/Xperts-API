const { createPost } = require("../../controllers/post.controller");
const postModel = require("../../models/post.model");

jest.mock("../../models/post.model");

let mockRequest = {
  body: {
    content: "This is a sample post content",
    category: "engineering",
  },
  currentUser: {
    _id: "64a7f0c4f1d2c8b5f6e8a9b1",
  },
};
let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

let mockPostInstance;

beforeEach(async () => {
  mockPostInstance = {
    ...mockRequest.body,
    author: mockRequest.currentUser._id,
    validate: jest.fn().mockResolvedValue(true),
  };

  postModel.mockImplementation(() => mockPostInstance);
  postModel.insertOne.mockResolvedValue(mockPostInstance);
});

describe("createPost", () => {
  it("should create a new post and return status 200", async () => {
    await createPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        data: mockPostInstance,
      })
    );
  });

  it("should should fail if validation fails ", async () => {
    mockPostInstance.validate = jest.fn(() => {
      const err = new Error("Validation failed");
      err.name = "ValidationError";
      throw err;
    });
    await createPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: expect.any(String),
      })
    );
  });

  it("should return status 500 if an unexpected error occurs", async () => {
    postModel.insertOne.mockImplementation(() => {
      throw new Error("DB error");
    });
    await createPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Error happened",
      })
    );
  });
});
