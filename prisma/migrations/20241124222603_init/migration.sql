-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "ContributorType" AS ENUM ('INDIVIDUAL', 'CONFERENCE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'VIDEO', 'TEXT');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('ARCHIVE', 'YOUTUBE', 'BUNNY');

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "fullName" CITEXT NOT NULL,
    "fullNameSlug" CITEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "type" "ContributorType" NOT NULL DEFAULT 'INDIVIDUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" SERIAL NOT NULL,
    "originalId" TEXT,
    "contributorId" INTEGER NOT NULL,
    "title" CITEXT NOT NULL,
    "description" TEXT,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "previouslyFeatured" BOOLEAN NOT NULL DEFAULT false,
    "preachedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonUrl" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "source" "MediaSource" NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "url" CITEXT NOT NULL,

    CONSTRAINT "SermonUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonBibleReference" (
    "id" SERIAL NOT NULL,
    "book" CITEXT NOT NULL,
    "startChapter" INTEGER,
    "endChapter" INTEGER,
    "startVerse" INTEGER,
    "endVerse" INTEGER,
    "text" TEXT NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonBibleReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonText" (
    "id" SERIAL NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "name" CITEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_SermonToTopic" (
    "A" INTEGER NOT NULL,
    "B" CITEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_fullName_key" ON "Contributor"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Sermon_title_contributorId_key" ON "Sermon"("title", "contributorId");

-- CreateIndex
CREATE UNIQUE INDEX "SermonText_sermonId_key" ON "SermonText"("sermonId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SermonToTopic_AB_unique" ON "_SermonToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_SermonToTopic_B_index" ON "_SermonToTopic"("B");

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonUrl" ADD CONSTRAINT "SermonUrl_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonBibleReference" ADD CONSTRAINT "SermonBibleReference_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonText" ADD CONSTRAINT "SermonText_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SermonToTopic" ADD CONSTRAINT "_SermonToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Sermon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SermonToTopic" ADD CONSTRAINT "_SermonToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("name") ON DELETE CASCADE ON UPDATE CASCADE;
