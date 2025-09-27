import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { join } from "path"
import { NestExpressApplication } from "@nestjs/platform-express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: ["http://localhost:3000", "http://frontend:3000"],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))

  // 👇 ini penting: serve static files di folder uploads
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: "/uploads/", // akses via http://localhost:3003/uploads/filename.jpg
  })

  await app.listen(process.env.PORT || 3003)
  console.log(`Attendance Service is running on port ${process.env.PORT || 3003}`)
}
bootstrap()
