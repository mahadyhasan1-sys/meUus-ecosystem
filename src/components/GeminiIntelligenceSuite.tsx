import React, { useState, useRef } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  BrainCircuit, 
  Globe, 
  MapPin, 
  Image as ImageIcon, 
  Film, 
  Mic, 
  Zap, 
  Cpu,
  FileSearch, 
  Upload, 
  Send, 
  Loader2, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';

type SuiteTab = 'chatbot' | 'thinking' | 'grounded' | 'images' | 'video' | 'multimodal' | 'audio' | 'fast';

export default function GeminiIntelligenceSuite() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SuiteTab>('chatbot');

  // --- 1. Chatbot State ---
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [chatRole, setChatRole] = useState<'guide' | 'mentor' | 'sme' | 'resolver'>('guide');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string; timestamp: string }>>([
    {
      role: 'model',
      content: 'Salam. I am your meUus AI Assistant. How can I walk beside you today? You can ask about our 9 pillars, SME trade roadmaps, the Universal Start Door, or reflective self-audits.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- 2. Thinking State ---
  const [thinkingPrompt, setThinkingPrompt] = useState('');
  const [thinkingContext, setThinkingContext] = useState('');
  const [thinkingResult, setThinkingResult] = useState<string | null>(null);
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);

  // --- 3. Grounded State (Search & Maps) ---
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps'>('search');
  const [groundedPrompt, setGroundedPrompt] = useState('');
  const [groundedDistrict, setGroundedDistrict] = useState('Dhaka');
  const [groundedResult, setGroundedResult] = useState<{ text: string; citations?: any[]; queries?: string[] } | null>(null);
  const [isGroundedLoading, setIsGroundedLoading] = useState(false);

  // --- 4. Image Studio State ---
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageModel, setImageModel] = useState<'gemini-3.1-flash-image-preview' | 'gemini-3-pro-image-preview'>('gemini-3.1-flash-image-preview');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '2:3' | '3:2' | '21:9'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // --- 5. Video Studio (Veo) State ---
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);
  const [generatedVideoUri, setGeneratedVideoUri] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // --- 6. Vision & Video Analyzer State ---
  const [analysisType, setAnalysisType] = useState<'image' | 'video'>('image');
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [uploadedMediaBase64, setUploadedMediaBase64] = useState<string | null>(null);
  const [mediaMimeType, setMediaMimeType] = useState('image/jpeg');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- 7. Voice & Audio Transcription State ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [audioLanguage, setAudioLanguage] = useState<'auto' | 'bn'>('auto');
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceReply, setVoiceReply] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- 8. Fast Response State ---
  const [fastPrompt, setFastPrompt] = useState('');
  const [fastResult, setFastResult] = useState<{ text: string; latencyMs: number } | null>(null);
  const [isFastLoading, setIsFastLoading] = useState(false);

  // Handlers

  // Chat Submission
  const handleSendChat = async () => {
    if (!inputMessage.trim() || isChatLoading) return;

    const userMsg = {
      role: 'user' as const,
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      let roleInstruction = '';
      if (chatRole === 'mentor') {
        roleInstruction = 'You are meUus Soul Mentor. Ground your guidance in holistic human flourishing, moral strength, and empathetic growth.';
      } else if (chatRole === 'sme') {
        roleInstruction = 'You are meUus SME & Livelihood Advisor. Focus on trade licensing, micro-enterprise bookkeeping, market discovery, and practical self-reliance.';
      } else if (chatRole === 'resolver') {
        roleInstruction = 'You are meUus Dispute & Community Resolver. Focus on de-escalation, mutual accountability, restorative justice, and objective facts under Claim <= Evidence.';
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          model: chatModel,
          systemInstruction: roleInstruction
        })
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (data.error) {
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            content: `Notice: ${data.error}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'Unable to connect to the Gemini service. Please check network connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Deep Thinking Handler
  const handleRunThinking = async () => {
    if (!thinkingPrompt.trim() || isThinkingLoading) return;
    setIsThinkingLoading(true);
    setThinkingResult(null);

    try {
      const res = await fetch('/api/deep-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: thinkingPrompt.trim(),
          context: thinkingContext.trim()
        })
      });
      const data = await res.json();
      setThinkingResult(data.text || data.error || 'No reasoning output produced.');
    } catch (err: any) {
      setThinkingResult(`Error: ${err?.message}`);
    } finally {
      setIsThinkingLoading(false);
    }
  };

  // Grounded Search / Maps Handler
  const handleRunGrounded = async () => {
    if (!groundedPrompt.trim() || isGroundedLoading) return;
    setIsGroundedLoading(true);
    setGroundedResult(null);

    const endpoint = groundingMode === 'search' ? '/api/search-grounded' : '/api/maps-grounded';
    const payload = groundingMode === 'search' 
      ? { prompt: groundedPrompt.trim() }
      : { prompt: groundedPrompt.trim(), district: groundedDistrict };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setGroundedResult({
        text: data.text || data.error || 'No grounded data returned.',
        citations: data.groundingChunks || [],
        queries: data.searchQueries || []
      });
    } catch (err: any) {
      setGroundedResult({ text: `Grounding Error: ${err?.message}` });
    } finally {
      setIsGroundedLoading(false);
    }
  };

  // Image Generation Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isImageLoading) return;
    setIsImageLoading(true);
    setGeneratedImageUrl(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          model: imageModel,
          aspectRatio,
          imageSize,
          baseImageBase64: editImageBase64
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else if (data.text) {
        setGeneratedImageUrl(null);
        alert(data.text);
      } else if (data.error) {
        alert(`Image Generation Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err?.message}`);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Video Generation Handler
  const handleGenerateVideo = async () => {
    if ((!videoPrompt.trim() && !videoSourceImage) || isVideoLoading) return;
    setIsVideoLoading(true);
    setGeneratedVideoUri(null);
    setVideoStatus('Initiating Veo 3 Video Generation...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspectRatio,
          imageBase64: videoSourceImage
        })
      });
      const data = await res.json();
      if (data.videoUri) {
        setGeneratedVideoUri(data.videoUri);
        setVideoStatus('Video generated successfully!');
      } else if (data.error) {
        setVideoStatus(`Error: ${data.error}`);
      } else {
        setVideoStatus(`Status: ${data.status || 'Complete'}`);
      }
    } catch (err: any) {
      setVideoStatus(`Error: ${err?.message}`);
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Multimodal Analysis Handler
  const handleRunAnalysis = async () => {
    if (!uploadedMediaBase64 || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const endpoint = analysisType === 'image' ? '/api/analyze-image' : '/api/analyze-video';
    const payload = analysisType === 'image'
      ? { imageBase64: uploadedMediaBase64, mimeType: mediaMimeType, prompt: analysisPrompt || undefined }
      : { videoBase64: uploadedMediaBase64, mimeType: mediaMimeType, prompt: analysisPrompt || undefined };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAnalysisResult(data.analysis || data.error || 'Analysis complete.');
    } catch (err: any) {
      setAnalysisResult(`Analysis Error: ${err?.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio Recording & Transcription Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access permission required for audio transcription and voice conversations.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleTranscribeAudio = async () => {
    if (!recordedAudioBase64 || isTranscribing) return;
    setIsTranscribing(true);
    setTranscriptionResult(null);

    try {
      const res = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: recordedAudioBase64,
          mimeType: 'audio/webm',
          language: audioLanguage
        })
      });
      const data = await res.json();
      setTranscriptionResult(data.transcription || data.error || 'Transcription finished.');
    } catch (err: any) {
      setTranscriptionResult(`Transcription Error: ${err?.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleVoiceConversationTurn = async () => {
    if (!recordedAudioBase64 || isTranscribing) return;
    setIsTranscribing(true);
    setVoiceReply(null);

    try {
      const res = await fetch('/api/voice-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: recordedAudioBase64,
          mimeType: 'audio/webm'
        })
      });
      const data = await res.json();
      setVoiceReply(data.replyText || data.error || 'Voice response generated.');
    } catch (err: any) {
      setVoiceReply(`Voice Error: ${err?.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Fast Response Handler
  const handleRunFast = async () => {
    if (!fastPrompt.trim() || isFastLoading) return;
    setIsFastLoading(true);
    setFastResult(null);

    try {
      const res = await fetch('/api/fast-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fastPrompt.trim() })
      });
      const data = await res.json();
      setFastResult({
        text: data.text || data.error || 'No output.',
        latencyMs: data.latencyMs || 0
      });
    } catch (err: any) {
      setFastResult({ text: `Error: ${err?.message}`, latencyMs: 0 });
    } finally {
      setIsFastLoading(false);
    }
  };

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (b64: string) => void, mimeSetter?: (m: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mimeSetter) mimeSetter(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <PageHeader
        icon={<Cpu size={18} />}
        title="Gemini Intelligence Suite"
        subtitle="Unified Multimodal Intelligence, Model Router, and Reasoning Engine."
        badge="AI Active"
        breadcrumb="Intelligence"
      />
      <section id="intelligence-suite" className="py-8 px-6 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Full Gemini Intelligence & Multimodal Suite
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Multimodal Human Development Hub
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mt-1">
              Empowering Bangladesh with cutting-edge Gemini reasoning, search & maps grounding, Veo video generation, and voice companions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Claim ≤ Evidence Status:</span>
            <Badge className="bg-emerald-50 border-emerald-200 text-emerald-800">Live Active Engine</Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-none">
          {[
            { id: 'chatbot', label: 'Gemini Chatbot', icon: MessageSquare },
            { id: 'thinking', label: 'High Thinking Mode', icon: BrainCircuit },
            { id: 'grounded', label: 'Search & Maps Grounding', icon: Globe },
            { id: 'images', label: 'Image Studio & Aspect Ratios', icon: ImageIcon },
            { id: 'video', label: 'Veo 3 Video Studio', icon: Film },
            { id: 'multimodal', label: 'Image & Video Analyzer', icon: FileSearch },
            { id: 'audio', label: 'Voice & Audio Transcription', icon: Mic },
            { id: 'fast', label: 'Low-Latency Lite', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SuiteTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600 font-semibold'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Chatbot */}
        {activeTab === 'chatbot' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Model & Persona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Model Engine</label>
                    <select
                      value={chatModel}
                      aria-label="Model Engine"
                      onChange={(e) => setChatModel(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 focus:border-emerald-500 outline-none"
                    >
                      <option value="gemini-3.5-flash">gemini-3.5-flash (General & Fast)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex & Deep)</option>
                      <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-Low Latency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Role / System Persona</label>
                    <select
                      value={chatRole}
                      aria-label="Role / System Persona"
                      onChange={(e) => setChatRole(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 focus:border-emerald-500 outline-none"
                    >
                      <option value="guide">meUus Starting Point Guide</option>
                      <option value="mentor">Soul Mentor (Moral & Personal Growth)</option>
                      <option value="sme">SME & Livelihood Trade Advisor</option>
                      <option value="resolver">Community & Dispute De-escalator</option>
                    </select>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600 space-y-1">
                    <div className="text-emerald-700 font-semibold">Governance Invariant:</div>
                    <p>All answers adhere strictly to the Claim ≤ Evidence rule and provide practical next steps for Bangladesh.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="bg-white border-gray-200 text-gray-900 flex flex-col h-[520px] shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-gray-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-sm text-gray-900">Multi-Turn Thread</span>
                  </div>
                  <Badge variant="outline" className="border-gray-200 text-gray-600 font-mono text-[10px] bg-gray-50">
                    {chatModel}
                  </Badge>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                            : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>
                        <div className="mt-1 text-[10px] opacity-60 text-right">{m.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2 text-xs text-gray-600">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        meUus is formulating an honest response...
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="p-3 border-t border-gray-100 bg-gray-50 flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Ask about SME trade guides, DLAS evaluation, legal referrals, or the 9 pillars..."
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={isChatLoading || !inputMessage.trim()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Tab 2: High Thinking Mode */}
        {activeTab === 'thinking' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-purple-600" /> High Thinking Engine (gemini-3.1-pro-preview)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Enables deep algorithmic reasoning with ThinkingLevel.HIGH to unpack intricate systemic challenges without artificial token truncation.
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-50 border-purple-200 text-purple-700">ThinkingLevel.HIGH</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Optional Problem Context / Boundary Parameters</label>
                  <textarea
                    rows={2}
                    value={thinkingContext}
                    onChange={(e) => setThinkingContext(e.target.value)}
                    placeholder="e.g. Bangladesh rural cottage industry: 3-member artisan family, 40,000 BDT capital, zero collateral for commercial bank loans..."
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Complex Inquiry / Dilemma</label>
                  <textarea
                    rows={3}
                    value={thinkingPrompt}
                    onChange={(e) => setThinkingPrompt(e.target.value)}
                    placeholder="e.g. What is the exact mathematical and institutional failure chain preventing unbanked micro-traders in Khulna from graduating to formalized SMEs, and what multi-step peer collateral mechanism solves it?"
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunThinking}
                    disabled={isThinkingLoading || !thinkingPrompt.trim()}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs"
                  >
                    {isThinkingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                    {isThinkingLoading ? 'Executing Deep Reasoning...' : 'Engage High Thinking'}
                  </button>
                </div>

                {thinkingResult && (
                  <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-purple-700 font-mono">
                      <span>Reasoning Output & Systematic Decomposition</span>
                      <span>Model: gemini-3.1-pro-preview</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {thinkingResult}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 3: Search & Maps Grounding */}
        {activeTab === 'grounded' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" /> Grounded Intelligence (gemini-3.5-flash)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Retrieve live, accurate citations using Google Search data and local context with Google Maps grounding.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGroundingMode('search')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        groundingMode === 'search' ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Google Search Grounding
                    </button>
                    <button
                      onClick={() => setGroundingMode('maps')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        groundingMode === 'maps' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Google Maps Grounding
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {groundingMode === 'maps' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Select Bangladesh District / Region
                    </label>
                    <select
                      value={groundedDistrict}
                      aria-label="Select Bangladesh District or Region"
                      onChange={(e) => setGroundedDistrict(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                    >
                      {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Bogra', 'Cox’s Bazar'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {groundingMode === 'search' ? 'Search Query / Fact Verification Prompt' : 'Geographic & Community Inquiry Prompt'}
                  </label>
                  <input
                    type="text"
                    value={groundedPrompt}
                    onChange={(e) => setGroundedPrompt(e.target.value)}
                    placeholder={
                      groundingMode === 'search'
                        ? 'e.g. Current Bangladesh SME trade license fees and municipal office submission regulations for 2026'
                        : 'e.g. Key agricultural produce trading hubs and cold storage facilities around Bogra district'
                    }
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunGrounded}
                    disabled={isGroundedLoading || !groundedPrompt.trim()}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs ${
                      groundingMode === 'search' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isGroundedLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    {isGroundedLoading ? 'Querying Grounded Sources...' : `Execute ${groundingMode === 'search' ? 'Search' : 'Maps'} Grounding`}
                  </button>
                </div>

                {groundedResult && (
                  <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                    <div className="text-xs md:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {groundedResult.text}
                    </div>

                    {groundedResult.queries && groundedResult.queries.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-[11px] font-mono text-gray-500 mb-1">Web Search Queries Executed:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {groundedResult.queries.map((q, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200">
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 4: Image Studio */}
        {activeTab === 'images' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-amber-500" /> Image Studio & Aspect Ratio Control
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Generate studio-quality imagery or upload photos to edit with text instructions using gemini-3.1-flash-image-preview and gemini-3-pro-image-preview.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Model Selection</label>
                    <select
                      value={imageModel}
                      aria-label="Image Model Selection"
                      onChange={(e) => setImageModel(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                    >
                      <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview (Fast Generation & Editing)</option>
                      <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (High-Quality Studio)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      aria-label="Image Aspect Ratio"
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                    >
                      <option value="1:1">1:1 (Square - Standard)</option>
                      <option value="16:9">16:9 (Landscape - Video/Banner)</option>
                      <option value="9:16">9:16 (Portrait - Mobile Story)</option>
                      <option value="4:3">4:3 (Traditional Monitor)</option>
                      <option value="3:4">3:4 (Portrait Document)</option>
                      <option value="2:3">2:3 (Classic Portrait)</option>
                      <option value="3:2">3:2 (Classic Landscape)</option>
                      <option value="21:9">21:9 (Cinematic Ultrawide)</option>
                    </select>
                  </div>

                  {imageModel === 'gemini-3-pro-image-preview' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Image Size Resolution</label>
                      <select
                        value={imageSize}
                        aria-label="Image Size Resolution"
                        onChange={(e) => setImageSize(e.target.value as any)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:border-emerald-500 outline-none"
                      >
                        <option value="1K">1K Resolution</option>
                        <option value="2K">2K Resolution (High Detail)</option>
                        <option value="4K">4K Resolution (Ultra Studio)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prompt / Edit Instructions</label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g. A serene, authentic tea garden in Sylhet, Bangladesh at sunrise, with misty hills, clean organic lighting, and high-fidelity photorealism."
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-500" /> Optional: Upload Existing Image to Edit / Transform
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setEditImageBase64)}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-amber-700 hover:file:bg-gray-200"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateImage}
                    disabled={isImageLoading || !imagePrompt.trim()}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs"
                  >
                    {isImageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    {isImageLoading ? 'Generating Image...' : editImageBase64 ? 'Apply Image Edit' : 'Generate Image'}
                  </button>
                </div>

                {generatedImageUrl && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center space-y-3">
                    <img
                      src={generatedImageUrl}
                      alt="Generated by Gemini"
                      referrerPolicy="no-referrer"
                      className="max-h-[480px] rounded-xl object-contain border border-gray-300 shadow-md"
                    />
                    <a
                      href={generatedImageUrl}
                      download="gemini-generated-image.png"
                      className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 rounded-lg flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Download Full Resolution
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 5: Veo 3 Video Studio */}
        {activeTab === 'video' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Film className="w-5 h-5 text-rose-500" /> Veo 3 Video Studio (veo-3.1-fast-generate-preview)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Generate high-definition video clips from text descriptions or animate existing photos with 16:9 (landscape) or 9:16 (portrait) aspect ratios.
                    </CardDescription>
                  </div>
                  <Badge className="bg-rose-50 border-rose-200 text-rose-700">Veo 3 Fast</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setVideoAspectRatio('16:9')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          videoAspectRatio === '16:9'
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        16:9 (Landscape - Standard)
                      </button>
                      <button
                        onClick={() => setVideoAspectRatio('9:16')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          videoAspectRatio === '9:16'
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        9:16 (Portrait - Mobile)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-rose-500" /> Optional: Upload Photo to Animate into Video
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setVideoSourceImage)}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-rose-700 hover:file:bg-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Video Scene Description</label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="e.g. A traditional wooden boat gliding smoothly down the Padma River during golden hour sunset, gentle water ripples, cinematic 4k drone pan."
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateVideo}
                    disabled={isVideoLoading || (!videoPrompt.trim() && !videoSourceImage)}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs"
                  >
                    {isVideoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
                    {isVideoLoading ? 'Synthesizing Veo Video...' : 'Generate Veo 3 Video'}
                  </button>
                </div>

                {videoStatus && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 flex items-center gap-2">
                    <Loader2 className={`w-3.5 h-3.5 text-rose-500 ${isVideoLoading ? 'animate-spin' : ''}`} />
                    <span>{videoStatus}</span>
                  </div>
                )}

                {generatedVideoUri && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center">
                    <video
                      src={generatedVideoUri}
                      controls
                      autoPlay
                      loop
                      className="max-h-[440px] rounded-xl border border-gray-300 shadow-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 6: Multimodal Vision & Video Analyzer */}
        {activeTab === 'multimodal' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-teal-600" /> Image & Video Understanding (gemini-3.1-pro-preview)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Upload photos (trade licenses, field soil tests, certificates) or video recordings to perform deep analytical inspection.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAnalysisType('image')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${analysisType === 'image' ? 'bg-teal-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Image Analysis
                    </button>
                    <button
                      onClick={() => setAnalysisType('video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${analysisType === 'video' ? 'bg-teal-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Video Analysis
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-teal-600" /> Select {analysisType === 'image' ? 'Photo / Document' : 'Video Clip'} to Analyze
                  </label>
                  <input
                    type="file"
                    accept={analysisType === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileUpload(e, setUploadedMediaBase64, setMediaMimeType)}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-teal-700 hover:file:bg-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Analysis Objective (Optional)</label>
                  <input
                    type="text"
                    value={analysisPrompt}
                    onChange={(e) => setAnalysisPrompt(e.target.value)}
                    placeholder="e.g. Transcribe all Bengali text from this document, audit the trade registration seal, and list missing items."
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing || !uploadedMediaBase64}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all shadow-xs"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                    {isAnalyzing ? 'Analyzing Media...' : 'Execute Multimodal Analysis'}
                  </button>
                </div>

                {analysisResult && (
                  <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                    <div className="text-xs text-teal-700 font-mono font-semibold">Gemini Pro Analysis Output</div>
                    <div className="text-xs md:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {analysisResult}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 7: Voice Companion & Audio Transcription */}
        {activeTab === 'audio' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Mic className="w-5 h-5 text-emerald-600" /> Voice Conversation & Audio Transcription
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Live microphone voice conversation with gemini-3.1-flash-live-preview and speech-to-text audio transcription with gemini-3.5-flash.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs md:text-sm flex items-center gap-2 shadow-xs transition-all"
                      >
                        <Mic className="w-4 h-4" /> Start Microphone Input
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs md:text-sm flex items-center gap-2 animate-pulse transition-all shadow-xs"
                      >
                        <Square className="w-4 h-4 fill-white" /> Stop Recording Audio
                      </button>
                    )}
                  </div>

                  {recordedAudioBase64 && (
                    <div className="text-xs text-emerald-700 font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Audio captured and ready for processing.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" /> Live Voice Conversation Turn
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Have a natural spoken dialogue with the meUus Voice Companion using real-time conversational processing.
                    </p>
                    <button
                      onClick={handleVoiceConversationTurn}
                      disabled={!recordedAudioBase64 || isTranscribing}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      {isTranscribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      Send to Voice Companion
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-600" /> Speech-to-Text Transcription
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Transcribe audio verbatim with speaker formatting (Supports Bengali and English).
                    </p>
                    <button
                      onClick={handleTranscribeAudio}
                      disabled={!recordedAudioBase64 || isTranscribing}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      {isTranscribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5" />}
                      Transcribe Audio (gemini-3.5-flash)
                    </button>
                  </div>
                </div>

                {voiceReply && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" /> Voice Companion Reply:
                    </div>
                    <p className="text-xs md:text-sm text-emerald-950 leading-relaxed">{voiceReply}</p>
                  </div>
                )}

                {transcriptionResult && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="text-xs text-blue-700 font-mono font-semibold">Audio Transcription Result:</div>
                    <p className="text-xs md:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{transcriptionResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 8: Fast Response (Flash-Lite) */}
        {activeTab === 'fast' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-white border-gray-200 text-gray-900 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" /> Ultra-Low Latency Engine (gemini-3.1-flash-lite)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-xs">
                      Lightweight, rapid responses tailored for real-time validation, micro-checklists, and instant translations.
                    </CardDescription>
                  </div>
                  <Badge className="bg-amber-50 border-amber-200 text-amber-700">Fast Lite Mode</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quick Prompt / Request</label>
                  <input
                    type="text"
                    value={fastPrompt}
                    onChange={(e) => setFastPrompt(e.target.value)}
                    placeholder="e.g. Generate 3 rapid checklist items for opening a municipal trade license in Bogra."
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleRunFast}
                    disabled={isFastLoading || !fastPrompt.trim()}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs md:text-sm flex items-center gap-2 rounded-xl transition-all shadow-xs"
                  >
                    {isFastLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isFastLoading ? 'Processing Fast...' : 'Execute Instant Query'}
                  </button>
                </div>

                {fastResult && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-700 font-mono font-semibold">
                      <span>Instant Response</span>
                      <span>Latency: {fastResult.latencyMs} ms</span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {fastResult.text}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
    </div>
  );
}
