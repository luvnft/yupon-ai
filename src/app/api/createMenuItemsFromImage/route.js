import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import UserInfo from "@/models/userInfo.js";
import dbConnect from "@/utils/dbConnect";
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

function isPrice(text) {
  // Check if the text consists of an optional dollar sign followed by digits and at most one decimal point
  return /^\$?\d*\.?\d+$/.test(text);
}

function isToLeftAndAligned(box1, box2) {
  // Check if box1's right edge is to the left of box2's left edge
  const isToLeft =
    box1.boundingPoly.vertices[1].x < box2.boundingPoly.vertices[0].x;

  // Check if both boxes are vertically aligned (their midpoints should be close)
  const mid1 =
    (box1.boundingPoly.vertices[0].y + box1.boundingPoly.vertices[3].y) / 2;
  const mid2 =
    (box2.boundingPoly.vertices[0].y + box2.boundingPoly.vertices[3].y) / 2;
  const isVerticallyAligned =
    Math.abs(mid1 - mid2) <
    Math.max(
      box1.boundingPoly.vertices[3].y - box1.boundingPoly.vertices[0].y,
      box2.boundingPoly.vertices[3].y - box2.boundingPoly.vertices[0].y
    ) *
      0.5;

  return isToLeft && isVerticallyAligned;
}

function concatenateAdjacentTextsToPrice(startIndex, priceBox, detections) {
  let menuItemTexts = [];
  let currentIndex = startIndex;

  while (
    currentIndex >= 0 &&
    isToLeftAndAligned(detections[currentIndex], priceBox)
  ) {
    menuItemTexts.unshift(detections[currentIndex].description);
    currentIndex--;
  }

  return menuItemTexts.join(" ");
}

async function extractMenuItemsWithPrices(detections) {
  const menuItems = [];

  detections.slice(1).forEach((currentText, idx) => {
    if (isPrice(currentText.description)) {
      for (let i = idx - 1; i >= 0; i--) {
        if (isToLeftAndAligned(detections[i], currentText)) {
          const menuItem = concatenateAdjacentTextsToPrice(
            i,
            currentText,
            detections
          );
          menuItems.push({ item: menuItem, price: currentText.description });
          break;
        }
      }
    }
  });

  return menuItems;
}

export async function POST(request) {
  const { user } = await getSession();
  const { image_url } = await request.json();

  let fileName = image_url;

  await dbConnect();

  const existingUserInfo = await UserInfo.findOne({ email: user.email });

  if (!existingUserInfo) {
    return NextResponse.json({ error: "User information doesn't exist" });
  }

  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;

  const menuItems = await extractMenuItemsWithPrices(detections);

  // set existingUserInfo.menu_items
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].item.length < 4) continue; // ignore menu items with less than 4 characters
    existingUserInfo.menu_items.push({
      name: menuItems[i].item,
      price: menuItems[i].price,
      // make the points_cost equal to the price rounded to the nearest whole number * 20
      points_cost: Math.round(menuItems[i].price) * 20,
      // make the points_received equal to the price rounded to the nearest whole number * 2
      points_received: Math.round(menuItems[i].price) * 2,
    });
  }
  const savedUserInfo = await existingUserInfo.save();

  return NextResponse.json({
    message: "User information saved successfully",
    data: savedUserInfo,
  });
}
