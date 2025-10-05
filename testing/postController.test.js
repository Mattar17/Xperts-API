const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const postModel = require("../models/post.model");

jest.mock("../models/post.model");

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

describe("getAllPosts", () => {
  it("should return posts with status 200", async () => {
    const mockPosts = [{ _id: "1", title: "Test" }];
    postModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(mockPosts),
    });

    mockRequest.query = { page: 1, filter: "" };
    await getAllPosts(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      posts: mockPosts,
    });
  });

  it("should return 404 when no posts found", async () => {
    postModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue([]),
    });

    mockRequest.query = { page: 1 };
    await getAllPosts(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 on error", async () => {
    postModel.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});

describe("createPost", () => {
  it("should create a post successfully", async () => {
    const mockPost = { validate: jest.fn(), author: null };
    postModel.mockImplementation(() => mockPost);

    mockRequest.body = { content: "New Post" };
    mockRequest.currentUser = { _id: "123" };
    postModel.insertOne = jest.fn().mockResolvedValue(true);

    await createPost(mockRequest, mockResponse);

    expect(mockPost.author).toBe("123");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      data: mockPost,
    });
  });

  it("should return 403 on validation error", async () => {
    const mockPost = {
      validate: jest
        .fn()
        .mockRejectedValue({ name: "ValidationError", message: "Invalid" }),
    };
    postModel.mockImplementation(() => mockPost);

    mockRequest.body = {};
    mockRequest.currentUser = { _id: "123" };

    await createPost(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });
});

describe("updatePost", () => {
  it("should update a post successfully", async () => {
    const mockPost = {
      author: { email: "user@test.com" },
      save: jest.fn(),
    };
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPost),
    });

    mockRequest.query = { _id: "1" };
    mockRequest.body = { title: "Updated" };
    mockRequest.currentUser = { email: "user@test.com" };

    await updatePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if post not found", async () => {
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    mockRequest.query = { _id: "1" };
    await updatePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it("should return 403 if user not allowed", async () => {
    const mockPost = { author: { email: "other@test.com" } };
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPost),
    });

    mockRequest.query = { _id: "1" };
    mockRequest.currentUser = { email: "me@test.com" };

    await updatePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });
});

describe("deletePost", () => {
  it("should delete a post successfully", async () => {
    const mockPost = {
      author: { email: "user@test.com" },
      deleteOne: jest.fn(),
    };
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPost),
    });

    mockRequest.query = { _id: "1" };
    mockRequest.currentUser = { email: "user@test.com" };

    await deletePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      message: "Post deleted successfully",
    });
  });

  it("should return 404 if post not found", async () => {
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    mockRequest.query = { _id: "1" };
    await deletePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it("should return 403 if user not allowed", async () => {
    const mockPost = { author: { email: "other@test.com" } };
    postModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPost),
    });

    mockRequest.query = { _id: "1" };
    mockRequest.currentUser = { email: "me@test.com" };

    await deletePost(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });
});
