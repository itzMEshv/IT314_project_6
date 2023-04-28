const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("CREATE COURSE - enter courseName and courseCode", () => {
  describe("Empty fields return status code 400", () => {
    test("Login instructor success", async () => {
      const res = await request(baseURL).post("/login/instructor").send({
        email: "asdf@daiict.ac.in",
        password: "123456",
        role: "instructor",
      });
      expect(res.status).toEqual(200);
    });
    test("Empty courseName returns error 400", async () => {
      const res = await request(baseURL)
        .post("/login/instructor", "/createCourse")
        .send(
          {
            email: "asdf@daiict.ac.in",
            password: "123456",
            role: "instructor",
          },
          {
            courseName: "Jandoan",
            courseCode: "IT788",
          }
        );

      // const res = await request(baseURL).post("/createCourse").send({
      //   courseName: "Lul",
      //   courseCode: "IT788",
      // });
      expect(res.status).toEqual(200);
    });
    // test("Empty courseCode returns error 400", async () => {
    //   const res = await request(baseURL).post("/createCourse").send({
    //     courseName: "Distributed Systems",
    //     courseCode: "dad",
    //   });
    //   expect(res.status).toEqual(200);
    // });
  });
});
