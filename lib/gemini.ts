// Gemini AI service for streaming responses

export async function streamGeminiResponse(
  prompt: string,
  onChunk: (text: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'demo-key';
    
    // Mock streaming response for demo purposes
    // In production, this would call the actual Gemini API
    const mockResponse = generateMockResponse(prompt);
    
    // Simulate streaming by splitting response into chunks
    const words = mockResponse.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      onChunk(currentText);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    onComplete();
  } catch (error) {
    console.error('Gemini API error:', error);
    onChunk('I apologize, but I encountered an error. Please try again.');
    onComplete();
  }
}

function generateMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Context-aware responses based on prompt content
  if (lowerPrompt.includes('headache') || lowerPrompt.includes('head')) {
    return 'Headaches can have various causes. Based on your recent check-ins showing irregular sleep patterns, it could be related to sleep quality. I recommend maintaining consistent sleep schedules, staying hydrated, and monitoring if the headaches persist. If they become severe or frequent, please consult a healthcare provider.';
  }
  
  if (lowerPrompt.includes('sleep') || lowerPrompt.includes('tired')) {
    return 'I notice your sleep quality has been variable recently. Good sleep hygiene can help: try maintaining a consistent sleep schedule, avoiding screens before bed, keeping your room cool and dark, and avoiding caffeine in the afternoon. Your recent pattern shows improvement is possible with consistency.';
  }
  
  if (lowerPrompt.includes('energy') || lowerPrompt.includes('fatigue')) {
    return 'Your energy levels have shown some fluctuation. This could be related to sleep quality, nutrition, or stress. I recommend ensuring adequate hydration, regular light exercise, balanced meals, and consistent sleep patterns. The data shows your energy improves when you maintain regular check-in habits.';
  }
  
  if (lowerPrompt.includes('mood') || lowerPrompt.includes('feeling')) {
    return 'Your mood tracking shows valuable patterns. Regular physical activity, good sleep, social connection, and stress management can all positively impact mood. I see from your history that your mood tends to improve with consistent healthy habits. Consider what activities bring you joy and try to incorporate them regularly.';
  }
  
  if (lowerPrompt.includes('symptom') || lowerPrompt.includes('pain')) {
    return 'I understand you&apos;re experiencing symptoms. It&apos;s important to track these carefully. Based on your check-in history, I can help identify patterns, but for persistent or severe symptoms, please consult a healthcare provider. Your consistent tracking is valuable for both you and your doctor.';
  }
  
  // Default helpful response
  return 'I&apos;m here to help you understand your health patterns based on your check-in data. I can provide insights about sleep, energy, mood, and other metrics you&apos;ve been tracking. What specific aspect of your health would you like to discuss?';
}
