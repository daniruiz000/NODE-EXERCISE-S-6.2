import mongoose from "mongoose"
import { connect } from "../src/db"
import { app, server } from "../src/index"
import { type IAuthor, Author, AllowedCountries } from "../src/models/Author"
import request from "supertest"
// Tenemos que tener una BBDD especifica de test.

describe("Author Controler", () => {
  const authorMoc: IAuthor = {
    email: "dan@gmail.com",
    password: "123456789",
    name: "Dani",
    country: AllowedCountries.SPAIN,
  }

  let token: string
  let authorId: string

  // Antes de hacer los tests:
  beforeAll(async () => {
    await connect() // Conecto a mongo pero a la BBDD de test mediante la biblioteca cross-env que nos permite modificar la variable de entorno del nombre de la BBDD desde el script de test.
    await Author.collection.drop() // Borramos los usuarios de la BBDD
  })
  // Cuando acaben los test:
  afterAll(async () => {
    await mongoose.connection.close() // Cerramos la conexión a mongo.
    server.close()
  })

  it("POST /author = this should create an author", async() => {
    const response = await request(app)
      .post("/author")
      .send(authorMoc)
      .set("Accept", "application/json")
      .expect(201)

    expect(response.body).toHaveProperty("_id")
    expect(response.body.email).toBe(authorMoc.email)
    authorId = response.body._id
  })
  it("POST /author/login with valide credentials return 200 and token", async () => {
    const credentials = {
      email: authorMoc.email,
      password: authorMoc.password
    }
    const response = await request(app)
      .post("/author/login")
      .send(credentials)
      .expect(200)

    expect(response.body).toHaveProperty("token")
    token = response.body.token
    console.log(token)
  })
  it("POST /author/login with wrong credentials return 401 and no token", async () => {
    const credentials = {
      email: "noexistingemail",
      password: "123"
    }
    const response = await request(app)
      .post("/author/login")
      .send(credentials)
      .expect(401)

    expect(response.body.token).toBeUndefined()
  })
  it("GET /author returns a list with the authors", async () => {
    const response = await request(app)
      .get("/author")
      .expect(200)
    expect(response.body.data).toBeDefined() // Esperamos que data este definido en la respuesta
    expect(response.body.data.length).toBe(1)
    expect(response.body.data[0].email).toBe(authorMoc.email)
    expect(response.body.totalItems).toBe(1)
    expect(response.body.totalPages).toBe(1)
    expect(response.body.currentPage).toBe(1)
    console.log(response.body)
  })
  it("PUT /author/id Modify author when token is send", async () => {
    const updatedData = {
      name: "Edu",
    }
    const response = await request(app)
      .put(`/author/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
    expect(response.body.name).toBe(updatedData.name)
    expect(response.body.email).toBe(authorMoc.email)
    expect(response.body._id).toBe(authorId)
  })
  it("PUT /author/id Should not modify author when no token is present", async () => {
    const updatedData = {
      country: AllowedCountries.COLOMBIA,
    }
    const response = await request(app)
      .put(`/author/${authorId}`)
      .send(updatedData)
      .expect(401)
    expect(response.body.error).toBe("No tienes autorización para realizar esta operación")
  })
  it("DELET /author/id Do not delete author when token does not exist", async () => {
    const response = await request(app)
      .delete(`/author/${authorId}`)
      .expect(401)
    expect(response.body.error).toBe("No tienes autorización para realizar esta operación")
  })
  it("DELET /author/id Delete author when token is ok", async () => {
    const response = await request(app)
      .delete(`/author/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    expect(response.body._id).toBe(authorId)
  })
})
