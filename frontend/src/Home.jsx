// src/components/Home.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Note: Removed useTheme and ThemeSwitcher as they are now in the main Navbar
import { Code, Trophy, Target, Users, ChevronRight, Play, CheckCircle, Zap } from 'lucide-react';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  const codeSnippets = [
    '#include <iostream>', '#include <vector>', '#include <unordered_map>',
    '#include <algorithm>', 'using namespace std;', '', 'class Solution {', 'public:',
    '    vector<int> twoSum(vector<int>& nums, int target) {',
    '        unordered_map<int, int> mp;',
    '        for(int i = 0; i < nums.size(); i++) {',
    '            if(mp.find(target - nums[i]) != mp.end())',
    '                return {mp[target - nums[i]], i};', '            mp[nums[i]] = i;',
    '        }', '        return {};', '    }', '};',
  ];

  const outputText = `[Executing solution.cpp...]\n\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\n\nExecution finished with code 0.`;

  useEffect(() => {
    let timer;
    if (phase === 'typing') {
      if (currentIndex < codeSnippets.length) {
        timer = setTimeout(() => {
          setTypedText(prev => prev + codeSnippets[currentIndex] + '\n');
          setCurrentIndex(prev => prev + 1);
        }, 80);
      } else {
        timer = setTimeout(() => setPhase('running'), 1000);
      }
    } else if (phase === 'running') {
      timer = setTimeout(() => setPhase('output'), 1500);
    } else if (phase === 'output') {
      timer = setTimeout(() => {
        setCurrentIndex(0); setTypedText(''); setPhase('typing');
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, phase, codeSnippets.length]);

  const stats = [
    { icon: Users, label: 'C++ Coders', value: '25K+' },
    { icon: Code, label: 'DSA Problems', value: '800+' },
    { icon: Trophy, label: 'Contests', value: '150+' },
    { icon: Target, label: 'AC Rate', value: '78%' }
  ];

  const features = [
    { icon: Play, title: 'C++ Online Judge', description: 'Compile and run C++17/C++20 code with optimized GCC compiler and detailed execution analysis.', color: 'from-emerald-400 to-green-500' },
    { icon: Trophy, title: 'Competitive Programming', description: 'Master algorithms like Dijkstra, KMP, and segment trees. Practice for ICPC, CodeForces, and AtCoder.', color: 'from-amber-400 to-orange-500' },
    { icon: Target, title: 'Data Structures & Algorithms', description: 'From basic arrays to advanced topics like Fenwick trees, persistent data structures, and graph algorithms.', color: 'from-violet-400 to-purple-500' },
    { icon: Users, title: 'C++ Community', description: 'Connect with fellow competitive programmers, discuss STL optimizations, and share elegant solutions.', color: 'from-blue-400 to-indigo-500' },
    { icon: CheckCircle, title: 'Performance Analytics', description: 'Track your time complexity improvements, memory usage, and contest ratings with detailed metrics.', color: 'from-indigo-400 to-violet-500' },
    { icon: Zap, title: 'Real-time Compilation', description: 'Instant compilation with GCC flags, runtime error detection, and memory leak analysis.', color: 'from-red-400 to-rose-500' }
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black text-slate-800 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/100 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/100 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/15 dark:bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-15 animate-pulse"></div>
      </div>

      {/* The main Navbar component will be rendered here by your App's router */}

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 dark:from-emerald-400 dark:via-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Master</span><br />
                <span className="text-slate-900 dark:text-white">Coding</span><br />
                <span className="bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">Skills</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Master competitive programming with C++. Practice DSA problems, compete in contests, and optimize your algorithms for speed and efficiency.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/problems">
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-emerald-500/25 transition-all transform hover:scale-105 flex items-center space-x-2">
                  <span>Start Solving</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/problems">
                <button className="px-8 py-4 border-2 border-blue-500/50 dark:border-emerald-500 rounded-lg font-semibold text-blue-600 dark:text-emerald-400 hover:bg-blue-500/10 dark:hover:bg-emerald-500/20 hover:text-blue-700 dark:hover:text-white transition-all">Browse DSA Problems</button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Code Animation */}
          <div className="relative">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl dark:shadow-none">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-4">solution.cpp</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed min-h-[300px]">
                {phase === 'output' ? (
                  <code className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{outputText}</code>
                ) : (
                  <>
                    <code className="text-emerald-700 dark:text-green-400">{typedText}</code>
                    {phase === 'typing' && <span className="animate-pulse text-slate-800 dark:text-slate-200">|</span>}
                  </>
                )}
              </pre>
            </div>
            <div className={`absolute -top-4 -right-4 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${phase === 'running' ? 'bg-amber-500 animate-pulse' : phase === 'output' ? 'bg-green-500 animate-bounce' : 'opacity-0'}`}>
              {phase === 'running' ? 'Running...' : 'Accepted ✓'}
            </div>
            <div className={`absolute -bottom-4 -left-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse transition-opacity duration-500 ${phase === 'output' ? 'opacity-100' : 'opacity-0'}`}>
              Runtime: 0ms ⚡ Memory: 8.2MB
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">Master C++</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From basic syntax to advanced competitive programming techniques. Build your algorithmic thinking with C++.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-xl -z-10"
                   style={{background: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`}}></div>
              <div className="h-full bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 group-hover:border-blue-400 dark:hover:border-emerald-500/50 transition-all group-hover:transform group-hover:scale-105 shadow-md group-hover:shadow-lg dark:shadow-none">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-slate-100/80 dark:bg-gradient-to-r dark:from-emerald-900/90 dark:to-blue-600/40 backdrop-blur-sm border border-slate-200 dark:border-emerald-500/30 rounded-2xl p-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Level Up Your C++ Skills?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of competitive programmers mastering algorithms and data structures with C++.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-emerald-500 dark:to-blue-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-emerald-500/25 transition-all transform hover:scale-105">
                Start Competitive Programming
              </button>
            </Link>
            <Link to="/problems">
              <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-emerald-500 hover:text-slate-900 dark:hover:text-white transition-all">
                Explore C++ Problems
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              CodeJudge
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CodeJudge. Empowering C++ developers worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;