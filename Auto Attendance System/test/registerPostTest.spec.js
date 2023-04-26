const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("STUDENT REGISTER", () => {
  // Empty field test cases returning 400

  describe("Entered email already exists (returns status code 500) working", () => {
    test("again redirects user to register page", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsal",
        lastName: "nesw",
        email: "vps@daiict.ac.in",
        password: "new",
        role: "student",
      });
      expect(res.status).toEqual(500);
    });
  });
  describe("Status code 400 - Empty fields", () => {
    test("Empty first name gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "",
        lastName: "nesw",
        email: "new_vadtsal@gmail.com",
        password: "new",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty last name gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsal",
        lastName: "",
        email: "new_vaftsal@gmail.com",
        password: "neow",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty email gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vafatsal",
        lastName: "nekw",
        email: "",
        password: "naew",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatstral",
        lastName: "nrew",
        email: "new_vattrsal@gmail.com",
        password: "",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
  });

  //Test cases for invalid password parameter format

  describe("Invalid Format of Password (Status code 401)", () => {
    test("password length < 8 gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsklal",
        lastName: "nelkw",
        email: "new_vlkatsal123@gmail.com",
        password: "new",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("password length > 15 gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "nefajfbaihfiauhfuahw",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("No Special Characters in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "neuhfuahw",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("No numbers in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "neuhfuahw",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("No letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "1234567941",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("Space present in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("No capital letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("No small letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
  });

  // Edge cases for parameter constraints

  describe("Boundary (Edge) cases of correct formats (Status code 200)", () => {
    test("One character first name works", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "nesw",
        email: "1@gmail.com",
        password: "New@23jij",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("One character last name works", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "U",
        email: "2@gmail.com",
        password: "newH&*7da8n",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 8 characters valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "3@gmail.com",
        password: "newY78@#",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 15 characters valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "4@gmail.com",
        password: "newY78@#hsjshss",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 special character valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "5@gmail.com",
        password: "newY78@jhsss",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 small character valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "8@gmail.com",
        password: "nEWY78@UFAI",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 capital character valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "6@gmail.com",
        password: "daU78@jfbab",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 number valid password is working", async () => {
      const res = await request(baseURL).post("/register/student").send({
        firstName: "a",
        lastName: "l",
        email: "7@gmail.com",
        password: "daU8@jfbab",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
  });
});

// For Instructor Register

describe("instructor REGISTER", () => {
  describe("Entered email already exists (returns status code 500) working", () => {
    test("", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsal",
        lastName: "nesw",
        email: "vps@daiict.ac.in",
        password: "new",
        role: "instructor",
      });
      expect(res.status).toEqual(500);
    });
  });

  // Empty field test cases returning 400
  describe("Status code 400 - Empty fields", () => {
    test("Empty first name gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "",
        lastName: "nesw",
        email: "new_vadtsal@gmail.com",
        password: "new",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty last name gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsal",
        lastName: "",
        email: "new_vaftsal@gmail.com",
        password: "neow",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty email gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vafatsal",
        lastName: "nekw",
        email: "",
        password: "naew",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatstral",
        lastName: "nrew",
        email: "new_vattrsal@gmail.com",
        password: "",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
  });

  //Test cases for invalid password parameter format

  describe("Invalid Format of Password (Status code 401)", () => {
    test("password length < 8 gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsklal",
        lastName: "nelkw",
        email: "new_vlkatsal123@gmail.com",
        password: "new",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("password length > 15 gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "nefajfbaihfiauhfuahw",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("No Special Characters in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "neuhfuahw",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("No numbers in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "neuhfuahw",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("No letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "1234567941",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("Space present in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("No capital letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("No small letters in password gives error", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "vatsaagl",
        lastName: "neagw",
        email: "new_vatsalsu123@gmail.com",
        password: "123456 941",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
  });

  // Boundry(Edge) cases for parameter constraints

  describe("Boundary (Edge) cases of correct formats (Status code 200)", () => {
    test("One character first name works", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "nesw",
        email: "11@gmail.com",
        password: "New@23jij",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("One character last name works", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "lU",
        email: "21@gmail.com",
        password: "newY78@#",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 8 characters valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "31@gmail.com",
        password: "newY78@#",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 15 characters valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "41@gmail.com",
        password: "newY78@#hsjshss",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 special character valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "51@gmail.com",
        password: "newY78@jhsss",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 small character valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "81@gmail.com",
        password: "nEWY78@UFAI",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 capital character valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "61@gmail.com",
        password: "daU78@jfbab",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Exactly 1 number valid password is working", async () => {
      const res = await request(baseURL).post("/register/instructor").send({
        firstName: "a",
        lastName: "l",
        email: "71@gmail.com",
        password: "daU8@jfbab",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
  });
});
