package com.mood_tracker.app

import android.os.Bundle
import androidx.core.view.WindowCompat

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // This makes the app draw behind system bars
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // Make status bar transparent
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        
        // Make navigation bar transparent  
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
    }
}