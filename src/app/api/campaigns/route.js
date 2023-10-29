import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import UserInfo from "@/models/userInfo.js";
import dbConnect from "@/utils/dbConnect";
import axios from "axios";
import FormData from "form-data";
// import { adsSdk } from "facebook-nodejs-business-sdk";

// const AdAccount = adsSdk.AdAccount;
// const Campaign = adsSdk.Campaign;

const apiUrl = "https://graph.facebook.com/v18.0/oauth/access_token";
const appId = process.env.META_APP_ID;
const appSecret = process.env.META_APP_SECRET;
const grantType = "fb_exchange_token";

export async function POST(request) {
  const { user } = await getSession();
  const { foodDescription, promotion, dailyBudget } = await request.json();

  await dbConnect();

  const existingUserInfo = await UserInfo.findOne({ email: user.email });

  /*if (existingUserInfo) {
    return NextResponse.json({ error: "User information already exists" });
  }

  const userInfo = new UserInfo({
    email: user.email,
    business_name,
    description,
    address,
    category,
  });
  const savedUserInfo = await userInfo.save();*/

  try {
    /*const queryParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: grantType,
      fb_exchange_token:
        "EAAMs8ZBFOio8BOZBuy95eMf9ililtoTLBA0FprPHNXHPvDfBiRvsZBjeh8ZCxyqv5KqUnsJyFmiZCWltrC7DPbN21YqZBr0VizOZC6QCxY360iUHL4GdZAMr5EhWcyqtWD37Iryrcm8bnYZBwMF3ioGg1h4U0bwgTZCJNTB2qNZBtCuvZBwIvPqo7sHH1ORwze9WP0nbm4jymXJUfwj5wZCx2QiHA8FQEcbHlUUdUnzQpjUmL6n2cxN73x5AZD",
    });

    const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);
    console.log("Access token retrieved successfully:", response.data);

    const access_token = response.data.access_token;
    const ad_account_id = process.env.AD_ACCOUNT_ID;*/

    /*const formData = new FormData();
    formData.append("name", "My First Campaign");
    formData.append("objective", "OUTCOME_TRAFFIC");
    formData.append("status", "PAUSED");
    formData.append("special_ad_categories", "[]");
    formData.append("access_token", access_token);

    const campaign_response = await axios.post(
      `https://graph.facebook.com/v18.0/act_${ad_account_id}/campaigns`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          //Authorization: `Bearer ${access_token}`,
        },
      }
    );*/

    //Prompt DALL-E to generate an ad for the image
    const dalle_response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: `professional picture of ${foodDescription} in a high quality kitchen`,
        n: 3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("DALLE RESPONSE:", dalle_response.data);

    //const imageUrl = dalle_response.data.data[0].url;
    const imageUrls = dalle_response.data.data;

    console.log("DALLE RESPONSE:", imageUrls);

    //send a post request to create a campaign
    const data = {
      name: `${existingUserInfo.business_name} Campaign`,
      objective: "OUTCOME_TRAFFIC",
      status: "PAUSED",
      special_ad_categories: "[]",
      access_token: process.env.ACCESS_TOKEN_LONG_LIVED,
      //"EAAMs8ZBFOio8BOZBuy95eMf9ililtoTLBA0FprPHNXHPvDfBiRvsZBjeh8ZCxyqv5KqUnsJyFmiZCWltrC7DPbN21YqZBr0VizOZC6QCxY360iUHL4GdZAMr5EhWcyqtWD37Iryrcm8bnYZBwMF3ioGg1h4U0bwgTZCJNTB2qNZBtCuvZBwIvPqo7sHH1ORwze9WP0nbm4jymXJUfwj5wZCx2QiHA8FQEcbHlUUdUnzQpjUmL6n2cxN73x5AZD",
    };

    const campaign_response = await axios.post(
      `https://graph.facebook.com/v18.0/act_${process.env.AD_ACCOUNT_ID}/campaigns`,
      data
    );

    console.log("CAMP DATA:", campaign_response);

    const campaign_id = campaign_response.data.id;

    // ad set

    const ad_set_data = {
      name: `${existingUserInfo.business_name} Ad Set`,
      optimization_goal: "LINK_CLICKS",
      billing_event: "IMPRESSIONS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      daily_budget: dailyBudget * 100,
      campaign_id: campaign_id,
      targeting: {
        geo_locations: {
          custom_locations: [
            {
              latitude: existingUserInfo.lat,
              longitude: existingUserInfo.lng,
              radius: 10,
              distance_unit: "mile",
            },
          ],
        },
      },
      status: "PAUSED",
      access_token: process.env.ACCESS_TOKEN_LONG_LIVED,
    };

    const ad_set_response = await axios.post(
      `https://graph.facebook.com/v18.0/act_${process.env.AD_ACCOUNT_ID}/adsets`,
      ad_set_data
    );

    const ad_set_id = ad_set_response.data.id;

    // ads and creatives for all images

    for (let i = 0; i < imageUrls.length; i++) {
      const ad_creative_data = {
        name: `${existingUserInfo.business_name} Creative`,
        object_story_spec: {
          page_id: "150999321432443",
          link_data: {
            picture: imageUrls[i].url,
            link: "https://google.com",
            message: `${existingUserInfo.business_name} is now offering ${promotion}!`,
            call_to_action: {
              type: "LEARN_MORE",
              value: {
                link: "https://google.com",
              },
            },
          },
        },
        degrees_of_freedom_spec: {
          creative_features_spec: {
            standard_enhancements: {
              enroll_status: "OPT_OUT",
            },
          },
        },
        access_token: process.env.ACCESS_TOKEN_LONG_LIVED,
      };

      const ad_creative_response = await axios.post(
        `https://graph.facebook.com/v18.0/act_${process.env.AD_ACCOUNT_ID}/adcreatives`,
        ad_creative_data
      );

      console.log("CREATIVE DATA:", ad_creative_response.data);

      const ad_data = {
        name: `${existingUserInfo.business_name} Ad`,
        adset_id: ad_set_id,
        creative: {
          creative_id: ad_creative_response.data.id,
        },
        status: "PAUSED",
        access_token: process.env.ACCESS_TOKEN_LONG_LIVED,
      };

      const ad_response = await axios.post(
        `https://graph.facebook.com/v18.0/act_${process.env.AD_ACCOUNT_ID}/ads`,
        ad_data
      );
    }

    return NextResponse.json({
      message: "Campaign created successfully",
      id: campaign_response.data.id,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return NextResponse.json({
      error: "Error retrieving access token",
    });
  }

  /*return NextResponse.json({
    message: "Something",
  });*/
}
