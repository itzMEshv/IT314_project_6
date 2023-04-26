const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("STUDENT LOGIN TESTS", () => {
  // Test cases returning 200

  describe("Status code 200 (success) - Correct login credentials", () => {
    test("Correct credentials returning status code 200", async () => {
      const res = await request(baseURL).post("/login/student").send({
        email: "vps@daiict.ac.in",
        password: "123",
        role: "student",
      });
      expect(res.status).toEqual(200);
    });
  });
  // Test cases returning 400

  describe("Status Code 400 - Empty Credentials", () => {
    test("Empty email", async () => {
      const res = await request(baseURL).post("/login/student").send({
        email: "",
        password: "123456",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty password", async () => {
      const res = await request(baseURL).post("/login/student").send({
        email: "vatsal@gmail.com",
        password: "",
        role: "student",
      });
      expect(res.status).toEqual(400);
    });
  });

  // Test cases returning 401

  describe("Status code 401 - UnAuthorized status code scenarios", () => {
    test("Invalid email format returns 401 unAuthorized code", async () => {
      const res = await request(baseURL).post("/login/student").send({
        email: "vatsal",
        password: "pass",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
    test("Valid email but wrong password returns 401 unAuthorized code", async () => {
      const res = await request(baseURL).post("/login/student").send({
        email: "poojan@gmail.com",
        password: "12pass",
        role: "student",
      });
      expect(res.status).toEqual(401);
    });
  });
});

describe("INSTRUCTOR LOGIN TESTS", () => {
  // Test cases returning 200 success
  describe("Status code 200 (success) - Correct login credentials", () => {
    test("Correct credentials returning status code 200", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "asdf@daiict.ac.in",
        password: "123456",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
  });

  // Test cases returning 400

  describe("Status Code 400 - Empty Credentials", () => {
    test("Empty email", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "",
        password: "123456",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
    test("Empty password", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "vatsal@gmail.com",
        password: "",
        role: "instructor",
      });
      expect(res.status).toEqual(400);
    });
  });

  // Test cases returning 401

  describe("Status code 401 - UnAuthorized status code scenarios", () => {
    test("Invalid email format returns 401 unAuthorized code", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "vatsal",
        password: "pass",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
    test("Valid email but wrong password returns 401 unAuthorized code", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "poojan@gmail.com",
        password: "12pass",
        role: "instructor",
      });
      expect(res.status).toEqual(401);
    });
  });
});

describe("INCORRECT ROLE (returns 401)", () => {
  // Test cases returning 200 success
  test("Instructor trying to log in studentPage", async () => {
    const res = await request(baseURL).post("/login/student").send({
      email: "asdf@daiict.ac.in",
      password: "123456",
      role: "student",
    });
    expect(res.status).toEqual(401);
  });
  test("Student trying to log in instructorPage", async () => {
    const res = await request(baseURL).post("/login/instructor").send({
      email: "vps@gmail.com",
      password: "123",
      role: "instructor",
    });
    expect(res.status).toEqual(401);
  });
  // Test cases returning 400
});
//   describe("Status Code 400 - Empty Credentials", () => {
//     test("Empty email", async () => {
//       const res = await request(baseURL).post("/login/instructor").send({
//         email: "",
//         password: "123456",
//         role: "instructor",
//       });
//       expect(res.status).toEqual(400);
//     });
//     test("Empty password", async () => {
//       const res = await request(baseURL).post("/login/instructor").send({
//         email: "vatsal@gmail.com",
//         password: "",
//         role: "instructor",
//       });
//       expect(res.status).toEqual(400);
//     });
//   });

//   // Test cases returning 401

//   describe("Status code 401 - UnAuthorized status code scenarios", () => {
//     test("Invalid email format returns 401 unAuthorized code", async () => {
//       const res = await request(baseURL).post("/login/instructor").send({
//         email: "vatsal",
//         password: "pass",
//         role: "instructor",
//       });
//       expect(res.status).toEqual(401);
//     });
//     test("Valid email but wrong password returns 401 unAuthorized code", async () => {
//       const res = await request(baseURL).post("/login/instructor").send({
//         email: "poojan@gmail.com",
//         password: "12pass",
//         role: "instructor",
//       });
//       expect(res.status).toEqual(401);
//     });
//   });
// });

// describe("INCORRECT ROLE", async () => {
//   describe("Instructor trying to log into student page with his/her correct credentials", async () => {
//     test("Correct credentials for instructor but trying to log in studentPage", async () => {
//       const res = await request(baseURL).post("/login/student").send({
//         email: "asdf@daiict.ac.in",
//         password: "123456",
//         role: "student",
//       });
//       expect(res.status).toEqual(401);
//     });
//   });
// });
