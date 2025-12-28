import { supabase } from './supabaseClient';

interface FakeMessage {
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const generateFakeActivity = async (userId: string) => {
  try {
    // Real UUIDs from dummy profiles
    const fakeUsers = [
      { id: '0bb7f960-4527-4cb9-9a16-32a5ff2f6346', name: 'Chioma Okonkwo' },
      { id: 'e6dc951b-e963-4a38-a3ae-df79ddb28308', name: 'Tunde Adebayo' },
      { id: '522296d3-9f08-41de-bc8a-f1a903c9e429', name: 'Aisha Yusuf' },
    ];

    // Generate fake notifications
    const fakeNotifications = [
      {
        user_id: userId,
        type: 'skill_interest',
        title: '10 people want to learn your skill!',
        body: 'Multiple students are interested in learning Python Programming from you. Keep up the great work!',
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        user_id: userId,
        type: 'skill_interest',
        title: '15 people want to learn your skill!',
        body: 'Your Graphics Design expertise is in high demand. Students are eager to swap with you!',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        user_id: userId,
        type: 'skill_interest',
        title: '8 people want to learn your skill!',
        body: 'Your UI/UX Design skills are attracting attention. More swap requests incoming!',
        read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      },
      {
        user_id: userId,
        type: 'activity_boost',
        title: 'Your profile is getting popular!',
        body: '20+ views on your profile this week. Keep engaging to attract more skill swaps!',
        read: false,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ];

    // Add message notifications from fake users
    fakeUsers.forEach((user, index) => {
      fakeNotifications.push({
        user_id: userId,
        type: 'message',
        title: `${user.name} messaged you`,
        body: `You have a new message from ${user.name}. Check your chat!`,
        read: false,
        created_at: new Date(Date.now() - (index + 1) * 1800000).toISOString(), // Staggered times
      });
    });

    // Insert fake notifications
    const { error: notifError } = await supabase
      .from('notifications')
      .insert(fakeNotifications);

    if (notifError) {
      console.error('Error inserting fake notifications:', notifError);
      throw notifError;
    }

    // Generate fake swap requests from real fake user IDs
    const fakeSwapRequests = fakeUsers.map((user, index) => ({
      requester_id: user.id,
      target_id: userId,
      conversation_id: `${user.id}-${userId}`,
      status: 'pending',
      created_at: new Date(Date.now() - (index + 1) * 1800000).toISOString(), // Staggered
    }));

    // Insert fake swap requests
    const { error: swapError } = await supabase
      .from('swap_requests')
      .insert(fakeSwapRequests);

    if (swapError) {
      console.error('Error inserting fake swap requests:', swapError);
      throw swapError;
    }

    // Generate fake messages from these users
    const fakeMessages: FakeMessage[] = [];
    fakeUsers.forEach((user, index) => {
      const conversationId = `${user.id}-${userId}`;
      fakeMessages.push({
        conversation_id: conversationId,
        sender_id: user.id,
        content: `Hi! I'm ${user.name.split(' ')[0]}. I saw your profile and I'm really interested in learning from you. When are you available for a skill swap?`,
        created_at: new Date(Date.now() - (index + 1) * 1800000 + 60000).toISOString(), // 1 min after request
      });
      fakeMessages.push({
        conversation_id: conversationId,
        sender_id: user.id,
        content: `I have some questions about your teaching style. Do you prefer online sessions or in-person?`,
        created_at: new Date(Date.now() - (index + 1) * 1800000 + 120000).toISOString(), // 2 min after
      });
    });

    // Insert fake messages
    const { error: msgError } = await supabase
      .from('messages')
      .insert(fakeMessages);

    if (msgError) {
      console.error('Error inserting fake messages:', msgError);
      throw msgError;
    }

    return { success: true, message: 'Fake activity generated successfully! Check your notifications and chats.' };
  } catch (error) {
    console.error('Error generating fake activity:', error);
    return { success: false, message: 'Failed to generate fake activity.' };
  }
};
