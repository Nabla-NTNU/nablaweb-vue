import { supabase } from "@/lib/supabaseClient";
  
interface GroupMember {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    dateJoined: Date;
    role: string;
    class: string
}
  
interface GroupDetails {
    groupMail: string;
    groupKind: string;
    groupName: string;
    groupUrl: string;
    logo: string;
    about: string,
    groupImage: string,
    groupMembers: GroupMember[];
}

export async function fetchGroupMeta(groupUrl: string) {
  return supabase
    .from('nabla_groups')
    .select(`
      group_mail,
      group_kind,
      group_name,
      group_url,
      logo,
      page: nabla_group_pages!nabkla_group_pages_group_fkey(about, group_image)
    `)
    .eq('group_url', groupUrl)
    .single();
}

export async function fetchMembers(group: string) {
  return supabase
    .from('nabla_group_members')
    .select(`
      order,
      member_role,
      date_joined,
      nabla_users(username, first_name, last_name, profile_picture, class)
    `)
    .eq('group', group)
    .eq('is_active', true)
    .order('order', { ascending: true });
}

export async function useGroup(groupUrl: string): Promise<GroupDetails | null> {
  const { data: groupData, error: groupError } = await fetchGroupMeta(groupUrl);
  if (groupError || !groupData) {
    console.error('Error fetching group meta:', groupError);
    return null;
  }

  const { data: membersData, error: membersError } = 
    await fetchMembers(groupUrl);
  if (membersError) {
    console.error('Error fetching members:', membersError);
    return null;
  }

  const members: GroupMember[] = (membersData || []).map(entry => {
    const user = entry.nabla_users as any;
    return {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.profile_picture,
      dateJoined: entry.date_joined,
      role: entry.member_role,
      isActive: true,
      class: user.class,
    };
  });

  return {
    groupMail: groupData.group_mail,
    groupKind: groupData.group_kind,
    groupName: groupData.group_name,
    groupUrl: groupData.group_url,
    logo: groupData.logo,
    about: groupData.page.about,
    groupImage: groupData.page.group_image,
    groupMembers: members,
  };
}
