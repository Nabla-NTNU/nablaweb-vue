// Deprecated!

// import { supabase } from "@/lib/supabaseClient"

// export async function get_groups() {
//     const { data, error } = await supabase
//         .from("nabla_groups")
//         .select(`
//             group_mail,
//             group_kind,
//             group_name,
//             group_url,
//             logo
//         `);

//     if (error) {
//         console.error("Error fetching groups:", error);
//         return [];
//     }

//     return data;
// }

// interface GroupPage {
//     about: string | Promise<string>;
//     groupImage: string;
// }
  
// interface GroupMember {
//     username: string;
//     firstName: string;
//     lastName: string;
//     profilePicture: string;
//     memberRole: string;
// }
  
// interface GroupDetails {
//     groupMail: string;
//     groupKind: string;
//     groupName: string;
//     groupUrl: string;
//     logo: string;
//     about: string,
//     groupImage: string,
//     members: GroupMember[];
// }

// export async function getGroupDetails(groupUrl: string): Promise<GroupDetails | null> {
//     const { data, error } = await supabase
//       .from("nabla_groups")
//       .select(`
//         group_mail,
//         group_kind,
//         group_name,
//         group_url,
//         logo,
//         page: nabla_group_pages!nabkla_group_pages_group_fkey(about, group_image),
//         members: nabla_group_members(
//           member_role,
//           nabla_users(username, first_name, last_name, profile_picture)
//         )
//       `)
//       .eq("group_url", groupUrl)
//       .single();
  
//     if (error) {
//       console.error("Error fetching group details:", error);
//       return null;
//     }
  
//     // Process the nested page data:
//     const pageData: GroupPage = {
//           about: data.page.about,
//           groupImage: data.page.group_image,
//         };
  
//     // Process the members: Each entry in data.members has a nested array nabla_users with one element.
//     const members: GroupMember[] = (data.members || []).map((entry: any) => {
//       const user = (entry.nabla_users) || {};
//       return {
//         username: user.username,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         profilePicture: user.profile_picture,
//         memberRole: entry.member_role,
//       };
//     });

//     return {
//       groupMail: data.group_mail,
//       groupKind: data.group_kind,
//       groupName: data.group_name,
//       groupUrl: data.group_url,
//       logo: data.logo,
//       about: pageData.about,
//       groupImage: pageData.groupImage,
//       members,
//     };
//   }