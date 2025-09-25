const { getAllPosts } = require("../../controllers/post.controller");
const postModel = require("../../models/post.model");

jest.mock("../../models/post.model");

let mockRequest = {
  query: { page: 2, filter: "" },
};

let mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("getAllPosts", () => {
  it("should return an array of posts", async () => {
    const mockPosts = [
      {
        _id: "1",
        title: "Post 1",
        content: "Content 1",
        author: { name: "Author 2", pfp_url: "url2" },
        comments: [
          { user: "User 3", comment: "Comment 3" },
          { user: "User 4", comment: "Comment 4" },
        ],
      },
      {
        _id: "2",
        title: "Post 2",
        content: "Content 2",
        author: { name: "Author 2", pfp_url: "url2" },
        comments: [
          { user: "User 3", comment: "Comment 3" },
          { user: "User 4", comment: "Comment 4" },
        ],
      },
    ];

    postModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(mockPosts),
    });

    await getAllPosts(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(postModel.find).toHaveBeenCalledWith({});
    expect(postModel.find().skip).toHaveBeenCalledWith(15);
    expect(postModel.find().limit).toHaveBeenCalledWith(15);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      posts: mockPosts,
    });
  });

  it("should filter posts by category", async () => {
    const mockPosts = [{ id: 1 }, { id: 2 }];
    mockRequest.query.filter = "Tech";
    mockRequest.query.page = null;

    postModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue(mockPosts),
    });

    await getAllPosts(mockRequest, mockResponse);
    expect(postModel.find).toHaveBeenCalledWith({ category: "Tech" });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      posts: mockPosts,
    });
    expect(postModel.find().skip).toHaveBeenCalledWith(0);
    expect(postModel.find().limit).toHaveBeenCalledWith(15);
  });

  it("should return 404 if no posts found", async () => {
    postModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockResolvedValue([]),
    });

    await getAllPosts(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "no posts",
    });
  });

  it("should return 500 on error", async () => {
    mockRequest = { query: {} };
    postModel.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getAllPosts(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Error happened",
    });
  });
});
