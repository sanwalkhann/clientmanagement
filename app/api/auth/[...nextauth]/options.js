import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";

import bcrypt from "bcrypt";
import Patient from "@/app/(models)/Patient";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google:", profile);

        let userRole = "Google User";
        if (profile?.email == "thissanwalkhan@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      profile(profile) {
        console.log("Profile github:", profile);
        let userRole = "Google User";

        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec();

          if (foundUser) {
            console.log("UserExists");
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );
            if (match) {
              console.log("password match");
              delete foundUser.password;

              foundUser["id"] = foundUser._id;

              foundUser["role"] = "Doctor";
              return foundUser;
            }
          }

          const foundPatient = await Patient.findOne({
            email: credentials.email,
          })
            .lean()
            .exec();

          if (foundPatient) {
            console.log("UserExists");
            const match = await bcrypt.compare(
              credentials.password,
              foundPatient.password
            );
            if (match) {
              console.log("password match");
              delete foundPatient.password;
              foundPatient["id"] = foundPatient._id;
              foundPatient["role"] = "Patient";
              return foundPatient;
            }
            router.push("/ClientMember");
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
