import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Settings, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardCustomize = () => {
  return (
    <motion.div 
      className="container mx-auto py-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Settings className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Customize Dashboard</h1>
          <p className="text-muted-foreground">
            Personalize your Mindful Health Hub experience
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Dashboard Widgets
          </CardTitle>
          <CardDescription>Drag and drop to reorder or toggle visibility</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Layers className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Health Metrics</h3>
                  <p className="text-xs text-muted-foreground">Daily health statistics</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200">Visible</Badge>
            </div>
            
            <div className="flex flex-col gap-4 items-center justify-center py-8">
              <p className="text-muted-foreground text-center">
                More customization options will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCustomize; 