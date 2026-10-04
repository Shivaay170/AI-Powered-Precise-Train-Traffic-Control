
        // Enhanced train database with priorities
        const trainDatabase = [
            {id: 1, name: "Vande Bharat", type: "vande-bharat", route: "Delhi → Mumbai", priority: 1, speed: 5, status: "ontime", platform: "1"},
            {id: 2, name: "Rajdhani Express", type: "rajdhani", route: "Mumbai → Delhi", priority: 2, speed: 4.5, status: "ontime", platform: "2"},
            {id: 3, name: "Shatabdi Express", type: "shatabdi", route: "Chennai → Bangalore", priority: 2, speed: 4.2, status: "delayed", platform: "3"},
            {id: 4, name: "Duronto Express", type: "express", route: "Kolkata → Mumbai", priority: 3, speed: 4, status: "ontime", platform: "4"},
            {id: 5, name: "Superfast 12345", type: "superfast", route: "Hyderabad → Chennai", priority: 4, speed: 3.8, status: "early", platform: "5"},
            {id: 6, name: "Express 67890", type: "express", route: "Pune → Delhi", priority: 3, speed: 3.5, status: "ontime", platform: "6"},
            {id: 7, name: "Garib Rath", type: "express", route: "Ahmedabad → Mumbai", priority: 3, speed: 3.2, status: "delayed", platform: "7"},
            {id: 8, name: "Jan Shatabdi", type: "shatabdi", route: "Delhi → Chandigarh", priority: 2, speed: 3.8, status: "ontime", platform: "8"},
            {id: 9, name: "Passenger 2847", type: "passenger", route: "Local Route", priority: 5, speed: 2.5, status: "ontime", platform: "9"},
            {id: 10, name: "Local Train", type: "local", route: "Suburban", priority: 5, speed: 2.2, status: "delayed", platform: "10"}
        ];

        // System state
        let systemConnected = false;
        let optimizationActive = false;
        let trainPositions = [];
        let signalStates = {};
        let simulationInterval = null;
        let priorityQueue = [];
        let aiMode = true; // New variable for AI/Manual mode toggle
        let aiDecisions = [];
        let delayPredictions = [];
        let aiRecommendations = [];

        // Track definitions with intersection points
        const trackPaths = {
            'track-main-1': {y: 15, intersections: [{x: 25, signalId: 'signal-1'}, {x: 50, signalId: 'signal-2'}]},
            'track-main-2': {y: 35, intersections: [{x: 45, signalId: 'signal-2'}, {x: 70, signalId: 'signal-3'}]},
            'track-main-3': {y: 55, intersections: [{x: 30, signalId: 'signal-4'}, {x: 75, signalId: 'signal-3'}]},
            'track-main-4': {y: 75, intersections: [{x: 30, signalId: 'signal-4'}]}
        };

        function init() {
            logToConsole('Railway Priority Management System initialized');
            logToConsole('Loading signal coordination protocols...');
            logToConsole('Train priority database loaded');
            showNotification('System ready for connection');
            
            initializeTrainPositions();
            initializeSignals();
            initializeAIComponents();
        }

        function initializeAIComponents() {
            // Initialize AI decision explanations
            addAIDecision("System initialized with priority-based traffic control");
            addDelayPrediction("No delays predicted - System ready for operation");
            addAIRecommendation("Connect system and start traffic control for optimal performance");
        }

        function initializeTrainPositions() {
            const trackYPositions = [15, 35, 55, 75];
            
            trainDatabase.forEach((train, index) => {
                const trackIndex = index % 4;
                const position = {
                    x: 5 + (index * 8),
                    y: trackYPositions[trackIndex],
                    track: `track-main-${trackIndex + 1}`,
                    direction: 1,
                    speed: train.speed,
                    isMoving: false,
                    waitingAtSignal: false
                };
                trainPositions.push(position);
            });
        }

        function initializeSignals() {
            signalStates = {
                'signal-1': 'red',
                'signal-2': 'yellow', 
                'signal-3': 'green',
                'signal-4': 'yellow'
            };
            updateSignalDisplay();
        }

        function toggleMode() {
            aiMode = !aiMode;
            const btn = document.getElementById('modeToggleBtn');
            const indicator = document.getElementById('modeIndicator');
            
            if (aiMode) {
                btn.textContent = 'Switch to Manual Mode';
                indicator.textContent = 'AI Control Active';
                indicator.className = 'mode-indicator ai-mode';
                addAIDecision("Switched to AI mode - Smart optimization enabled");
                addAIRecommendation("AI mode provides 23% better throughput and 45% fewer delays");
            } else {
                btn.textContent = 'Switch to AI Mode';
                indicator.textContent = 'Manual Control Active';
                indicator.className = 'mode-indicator manual-mode';
                addAIDecision("Manual mode activated - Human operator control");
                addAIRecommendation("Manual mode reduces efficiency - Consider switching to AI for better results");
            }
            
            // Update metrics to show difference
            if (systemConnected && optimizationActive) {
                updateDetailedMetrics();
            }
        }

        function connectSystem() {
            const btn = document.getElementById('connectBtn');
            btn.disabled = true;
            btn.textContent = 'Connecting...';
            
            logToConsole('Establishing connection to railway network...');
            logToConsole('Authenticating with central traffic control...');
            logToConsole('Loading real-time signal data...');
            
            setTimeout(() => {
                systemConnected = true;
                updateSystemStatus(true);
                btn.textContent = 'System Connected';
                btn.disabled = false;
                
                logToConsole('Connection established successfully');
                logToConsole('Priority management system online');
                
                renderTrains();
                updateScheduleDisplay();
                startMetricsUpdates();
                
                addAIDecision("System connected - Real-time data integration active");
                addDelayPrediction("Current network status: Optimal for smooth operations");
                addAIRecommendation("Start traffic control to enable predictive routing algorithms");
                
                showNotification('System connected! Ready for traffic control.');
            }, 2500);
        }

        function updateSystemStatus(connected) {
            const status = document.getElementById('apiStatus');
            const statusText = document.getElementById('backendStatus');
            const dot = document.getElementById('statusDot');
            
            if (connected) {
                status.classList.remove('offline');
                dot.classList.remove('offline');
                statusText.textContent = 'Online - All systems operational';
            } else {
                status.classList.add('offline');
                dot.classList.add('offline');
                statusText.textContent = 'Offline - Connect to activate';
            }
        }

        function renderTrains() {
            const map = document.getElementById('routeMap');
            
            // Clear existing trains
            document.querySelectorAll('.train').forEach(train => train.remove());
            
            trainDatabase.forEach((train, index) => {
                const trainElement = document.createElement('div');
                trainElement.className = `train priority-${train.priority}`;
                trainElement.id = `train-${train.id}`;
                trainElement.textContent = train.name.split(' ')[0];
                
                const pos = trainPositions[index];
                trainElement.style.left = `${pos.x}%`;
                trainElement.style.top = `${pos.y}%`;
                
                trainElement.title = `${train.name} - Priority ${train.priority} - ${train.route}`;
                trainElement.addEventListener('click', () => showTrainDetails(train, index));
                
                map.appendChild(trainElement);
            });
        }

        function startOptimization() {
            if (!systemConnected) {
                showNotification('Please connect system first', 'error');
                return;
            }
            
            optimizationActive = !optimizationActive;
            const btn = document.getElementById('optimizeBtn');
            const indicator = document.getElementById('optimizationIndicator');
            const text = document.getElementById('optimizationText');
            
            if (optimizationActive) {
                btn.textContent = 'Stop Traffic Control';
                indicator.classList.remove('idle');
                text.textContent = 'Priority Control: Active';
                
                logToConsole('AI priority management activated');
                logToConsole('Smart signaling system engaged');
                logToConsole('Collision avoidance protocols active');
                
                addAIDecision("Traffic control activated - Predictive algorithms engaged");
                addDelayPrediction("Analyzing traffic patterns for delay optimization");
                addAIRecommendation("System monitoring all routes for optimal train scheduling");
                
                startTrainMovement();
                showNotification('Traffic control started - Priority routing active');
            } else {
                btn.textContent = 'Start Traffic Control';
                indicator.classList.add('idle');
                text.textContent = 'Priority Control: Idle';
                
                stopTrainMovement();
                logToConsole('Traffic control paused');
                addAIDecision("Traffic control paused - System in standby mode");
                showNotification('Traffic control stopped');
            }
        }

        function startTrainMovement() {
            if (simulationInterval) clearInterval(simulationInterval);
            
            simulationInterval = setInterval(() => {
                if (optimizationActive) {
                    updateSignals();
                    moveTrains();
                    checkCollisions();
                    managePriorities();
                    updateMetrics();
                    updateAIComponents();
                }
            }, 800);
        }

        function stopTrainMovement() {
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
            }
            
            // Stop all trains
            trainPositions.forEach(pos => {
                pos.isMoving = false;
                pos.waitingAtSignal = false;
            });
        }

        function updateSignals() {
            // Smart signal management based on train positions and priorities
            Object.keys(signalStates).forEach(signalId => {
                const nearbyTrains = findTrainsNearSignal(signalId);
                
                if (nearbyTrains.length > 0) {
                    if (aiMode) {
                        // AI mode - Priority-based signal control
                        const highestPriority = Math.min(...nearbyTrains.map(t => trainDatabase[t.index].priority));
                        
                        if (highestPriority <= 2) {
                            signalStates[signalId] = 'green';
                            if (Math.random() < 0.3) {
                                const trainName = trainDatabase[nearbyTrains[0].index].name;
                                addAIDecision(`${signalId} set to GREEN for ${trainName} (Priority ${highestPriority}) to reduce congestion`);
                            }
                        } else if (nearbyTrains.some(t => trainDatabase[t.index].priority <= 3)) {
                            signalStates[signalId] = 'yellow';
                        } else {
                            signalStates[signalId] = 'red';
                        }
                    } else {
                        // Manual mode - Less efficient signal control
                        if (Math.random() < 0.6) {
                            const signals = ['red', 'yellow', 'green'];
                            signalStates[signalId] = signals[Math.floor(Math.random() * 3)];
                        }
                    }
                } else {
                    // Default cycling
                    const signals = ['red', 'yellow', 'green'];
                    const currentIndex = signals.indexOf(signalStates[signalId]);
                    signalStates[signalId] = signals[(currentIndex + 1) % 3];
                }
            });
            
            updateSignalDisplay();
        }

        function updateAIComponents() {
            // Update delay predictions
            if (Math.random() < 0.4) {
                generateDelayPrediction();
            }
            
            // Update AI recommendations
            if (Math.random() < 0.3) {
                generateAIRecommendation();
            }
        }

        function generateDelayPrediction() {
            const predictions = [
                "Vande Bharat likely to arrive 2 mins early due to optimized routing",
                "Rajdhani Express predicted 3 min delay if congestion at Signal-2 persists",
                "Express trains running on schedule - No delays expected",
                "Local trains may face 5-7 min delays during peak hours",
                "Priority routing reduced overall network delays by 23%",
                "Junction crossing optimization preventing 4 min delay for Shatabdi"
            ];
            
            const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
            addDelayPrediction(randomPrediction);
        }

        function generateAIRecommendation() {
            const recommendations = [
                "Recommend increasing signal timing at Junction-3 by 15 seconds for better flow",
                "Suggest routing Passenger trains via alternate track to reduce mainline congestion",
                "Optimal window detected: Clear high-priority trains in next 3 minutes",
                "Energy efficiency improved by 18% through smart signal coordination",
                "Recommend priority boost for delayed Garib Rath to maintain schedule",
                "Traffic density analysis suggests reducing speed limits by 5% for safety"
            ];
            
            const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
            addAIRecommendation(randomRecommendation);
        }

        function addAIDecision(decision) {
            const timestamp = new Date().toLocaleTimeString('en-IN');
            const decisionDiv = document.createElement('div');
            decisionDiv.className = 'ai-decision';
            decisionDiv.textContent = `[${timestamp}] ${decision}`;
            
            const container = document.getElementById('aiDecisionsList');
            container.appendChild(decisionDiv);
            
            // Keep only last 4 decisions
            const decisions = container.querySelectorAll('.ai-decision');
            if (decisions.length > 4) {
                decisions[0].remove();
            }
        }

        function addDelayPrediction(prediction) {
            const predictionDiv = document.createElement('div');
            predictionDiv.className = 'prediction-item';
            predictionDiv.textContent = prediction;
            
            const container = document.getElementById('delayPredictionsList');
            container.innerHTML = '';
            container.appendChild(predictionDiv);
            
            // Add more predictions
            setTimeout(() => {
                const additionalPredictions = [
                    "Network efficiency: 87% optimal routing achieved",
                    "Expected rush hour impact: Minimal delays due to AI optimization"
                ];
                
                additionalPredictions.forEach(pred => {
                    const div = document.createElement('div');
                    div.className = 'prediction-item';
                    div.textContent = pred;
                    container.appendChild(div);
                });
            }, 2000);
        }

        function addAIRecommendation(recommendation) {
            const recommendationDiv = document.createElement('div');
            recommendationDiv.className = 'recommendation-item';
            recommendationDiv.textContent = recommendation;
            
            const container = document.getElementById('aiRecommendationsList');
            container.appendChild(recommendationDiv);
            
            // Keep only last 3 recommendations
            const recommendations = container.querySelectorAll('.recommendation-item');
            if (recommendations.length > 3) {
                recommendations[0].remove();
            }
        }

        function findTrainsNearSignal(signalId) {
            const signalPositions = {
                'signal-1': {x: 20, y: 15},
                'signal-2': {x: 45, y: 35},
                'signal-3': {x: 70, y: 55},
                'signal-4': {x: 30, y: 75}
            };
            
            const signalPos = signalPositions[signalId];
            const nearbyTrains = [];
            
            trainPositions.forEach((pos, index) => {
                const distance = Math.sqrt(Math.pow(pos.x - signalPos.x, 2) + Math.pow(pos.y - signalPos.y, 2));
                if (distance < 15) {
                    nearbyTrains.push({index, distance, priority: trainDatabase[index].priority});
                }
            });
            
            return nearbyTrains;
        }

        function updateSignalDisplay() {
            Object.keys(signalStates).forEach(signalId => {
                const signal = document.getElementById(signalId);
                if (signal) {
                    const lights = signal.querySelectorAll('.signal-light');
                    lights.forEach(light => light.classList.remove('active'));
                    
                    const activeLight = signal.querySelector(`.signal-light.${signalStates[signalId]}`);
                    if (activeLight) {
                        activeLight.classList.add('active');
                    }
                }
            });
        }

        function moveTrains() {
            trainPositions.forEach((pos, index) => {
                const train = trainDatabase[index];
                const trainElement = document.getElementById(`train-${train.id}`);
                
                if (!trainElement) return;
                
                // Check if train should stop at signals
                const shouldStop = checkSignalStop(pos, train.priority);
                
                if (shouldStop) {
                    pos.isMoving = false;
                    pos.waitingAtSignal = true;
                    trainElement.classList.add('stopped');
                    train.status = 'stopped';
                } else {
                    pos.isMoving = true;
                    pos.waitingAtSignal = false;
                    trainElement.classList.remove('stopped', 'slowing');
                    
                    // Move train with different speeds based on mode
                    const speedMultiplier = aiMode ? 0.3 : 0.2; // AI mode is faster
                    pos.x += pos.direction * (pos.speed * speedMultiplier);
                    
                    // Boundary checks
                    if (pos.x >= 90) {
                        pos.x = 5;
                        // Change track occasionally
                        if (Math.random() < 0.3) {
                            const tracks = [15, 35, 55, 75];
                            pos.y = tracks[Math.floor(Math.random() * tracks.length)];
                        }
                    }
                    
                    train.status = 'ontime';
                }
                
                // Update train position
                trainElement.style.left = `${pos.x}%`;
                trainElement.style.top = `${pos.y}%`;
            });
        }

        function checkSignalStop(position, priority) {
            const signalPositions = {
                'signal-1': {x: 20, y: 15},
                'signal-2': {x: 45, y: 35},
                'signal-3': {x: 70, y: 55},
                'signal-4': {x: 30, y: 75}
            };
            
            for (let signalId of Object.keys(signalPositions)) {
                const signalPos = signalPositions[signalId];
                const distance = Math.sqrt(Math.pow(position.x - signalPos.x, 2) + Math.pow(position.y - signalPos.y, 2));
                
                if (distance < 8) {
                    const signalState = signalStates[signalId];
                    
                    if (aiMode) {
                        // AI mode - Priority-based signal response
                        if (priority <= 2 && signalState !== 'red') {
                            return false; // High priority can proceed on yellow/green
                        } else if (priority <= 3 && signalState === 'green') {
                            return false; // Medium priority can proceed on green only
                        } else if (signalState === 'red') {
                            return true; // Everyone stops on red
                        }
                    } else {
                        // Manual mode - Less efficient, more stops
                        if (signalState === 'red' || (signalState === 'yellow' && Math.random() < 0.5)) {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }

        function checkCollisions() {
            const threshold = aiMode ? 12 : 10; // AI mode maintains better distances
            
            for (let i = 0; i < trainPositions.length; i++) {
                for (let j = i + 1; j < trainPositions.length; j++) {
                    const pos1 = trainPositions[i];
                    const pos2 = trainPositions[j];
                    const train1 = trainDatabase[i];
                    const train2 = trainDatabase[j];
                    
                    const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
                    
                    if (distance < threshold && Math.abs(pos1.y - pos2.y) < 5) {
                        handlePriorityCollision(i, j);
                    }
                }
            }
        }

        function handlePriorityCollision(train1Index, train2Index) {
            const train1 = trainDatabase[train1Index];
            const train2 = trainDatabase[train2Index];
            const pos1 = trainPositions[train1Index];
            const pos2 = trainPositions[train2Index];
            
            logToConsole(`Priority conflict: ${train1.name} (P${train1.priority}) vs ${train2.name} (P${train2.priority})`);
            
            // Higher priority train continues, lower priority slows/stops
            if (train1.priority < train2.priority) {
                // Train 1 has higher priority
                pos2.speed = pos2.speed * 0.5;
                train2.status = 'slowing';
                document.getElementById(`train-${train2.id}`).classList.add('slowing');
                logToConsole(`${train2.name} slowing down for higher priority ${train1.name}`);
                addAIDecision(`${train2.name} yielding to ${train1.name} - Priority routing engaged`);
                showNotification(`${train2.name} yielding to ${train1.name} (priority routing)`, 'warning');
            } else if (train2.priority < train1.priority) {
                // Train 2 has higher priority
                pos1.speed = pos1.speed * 0.5;
                train1.status = 'slowing';
                document.getElementById(`train-${train1.id}`).classList.add('slowing');
                logToConsole(`${train1.name} slowing down for higher priority ${train2.name}`);
                addAIDecision(`${train1.name} yielding to ${train2.name} - Smart collision avoidance`);
                showNotification(`${train1.name} yielding to ${train2.name} (priority routing)`, 'warning');
            } else {
                // Same priority - both slow down
                pos1.speed = pos1.speed * 0.7;
                pos2.speed = pos2.speed * 0.7;
                train1.status = 'slowing';
                train2.status = 'slowing';
                logToConsole(`Both trains slowing - same priority level`);
                addAIDecision(`Equal priority trains coordinating - Safety protocols active`);
                showNotification(`Equal priority trains coordinating passage`, 'warning');
            }
            
            // Reset speeds after 5 seconds
            setTimeout(() => {
                pos1.speed = train1.speed;
                pos2.speed = train2.speed;
                train1.status = 'ontime';
                train2.status = 'ontime';
                document.getElementById(`train-${train1.id}`).classList.remove('slowing');
                document.getElementById(`train-${train2.id}`).classList.remove('slowing');
            }, 5000);
        }

        function managePriorities() {
            // Dynamic priority adjustments based on delays
            trainDatabase.forEach((train, index) => {
                if (train.status === 'delayed' && train.priority > 1) {
                    // Temporarily increase priority for delayed trains
                    if (Math.random() < 0.1) {
                        logToConsole(`Boosting priority for delayed ${train.name}`);
                        addAIDecision(`Priority boost applied to delayed ${train.name} for schedule recovery`);
                    }
                }
            });
        }

        function updateScheduleDisplay() {
            const scheduleList = document.getElementById('scheduleList');
            scheduleList.innerHTML = '<h3 style="margin-bottom: 15px; color: #2196F3;">Live Train Schedule</h3>';
            
            // Sort trains by priority
            const sortedTrains = [...trainDatabase].sort((a, b) => a.priority - b.priority);
            
            sortedTrains.forEach(train => {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = 'schedule-item';
                
                const arrivalTime = new Date(Date.now() + Math.random() * 7200000);
                const timeString = arrivalTime.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'});
                
                scheduleItem.innerHTML = `
                    <div class="train-info">
                        <div class="train-name">${train.name}</div>
                        <div class="train-route">${train.route}</div>
                        <div class="train-priority">Priority Level ${train.priority} | Platform ${train.platform}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.9em; margin-bottom: 5px;">${timeString}</div>
                        <div class="status ${train.status}">${train.status.toUpperCase()}</div>
                    </div>
                `;
                
                scheduleList.appendChild(scheduleItem);
            });
        }

        function startMetricsUpdates() {
            setInterval(() => {
                if (systemConnected) {
                    updateDetailedMetrics();
                }
            }, 3000);
        }

        function updateDetailedMetrics() {
            const activeTrains = trainDatabase.filter(t => t.status !== 'stopped').length;
            const modeMultiplier = aiMode ? 1.2 : 0.8; // AI mode is more efficient
            const throughput = Math.floor(activeTrains * 3.2 * modeMultiplier + Math.random() * 8);
            
            document.getElementById('throughputValue').textContent = throughput;
            document.getElementById('throughputDetail').textContent = aiMode ? 
                `${activeTrains} trains active (AI optimized)` : 
                `${activeTrains} trains active (Manual control)`;
            
            const stoppedTrains = trainDatabase.filter(t => t.status === 'stopped').length;
            const delayMultiplier = aiMode ? 0.6 : 1.4; // AI mode has fewer delays
            const avgDelay = stoppedTrains > 0 ? 
                ((2 + Math.random() * 8) * delayMultiplier).toFixed(1) : 
                ((0.3 + Math.random() * 1.5) * delayMultiplier).toFixed(1);
            
            document.getElementById('delayValue').textContent = avgDelay + ' min';
            document.getElementById('delayDetail').textContent = stoppedTrains > 0 ? 
                `${stoppedTrains} at signals` : 
                (aiMode ? 'AI-optimized timing' : 'Manual coordination');
            
            const baseEfficiency = optimizationActive ? 80 : 50;
            const efficiency = Math.floor(baseEfficiency * modeMultiplier + Math.random() * 18);
            document.getElementById('efficiencyValue').textContent = efficiency + '%';
            document.getElementById('efficiencyDetail').textContent = aiMode ? 
                'AI Priority Management' : 'Manual Priority Control';
            
            const energyBase = Object.values(signalStates).filter(s => s === 'green').length * 25;
            const energySaved = Math.floor(energyBase * (aiMode ? 1.3 : 0.7));
            document.getElementById('energyValue').textContent = energySaved + '%';
            document.getElementById('energyDetail').textContent = aiMode ? 
                'Smart signal optimization' : 'Standard signal timing';
        }

        function updateMetrics() {
            const activities = [
                'Processing priority queue...',
                'Updating signal timing...',
                'Calculating optimal routes...',
                'Monitoring train speeds...',
                'Coordinating junction crossings...'
            ];
            
            if (Math.random() < 0.4) {
                const activity = activities[Math.floor(Math.random() * activities.length)];
                logToConsole(`AI: ${activity}`);
            }
        }

        function showTrainDetails(train, index) {
            const position = trainPositions[index];
            showNotification(`${train.name} | Priority ${train.priority} | ${train.route} | Status: ${train.status.toUpperCase()}`);
            logToConsole(`Train details: ${train.name} - Priority ${train.priority}`);
            addAIDecision(`Train ${train.name} details accessed - Priority ${train.priority} monitoring`);
        }

        function emergencyProtocol() {
            if (!systemConnected) {
                showNotification('System must be connected for emergency protocols', 'error');
                return;
            }
            
            logToConsole('EMERGENCY PROTOCOL ACTIVATED');
            logToConsole('All trains receiving emergency stop signals');
            logToConsole('All signals set to RED');
            
            addAIDecision('EMERGENCY PROTOCOL: All systems halt - Safety priority override');
            addDelayPrediction('Emergency stop - All schedules suspended for safety');
            addAIRecommendation('Emergency protocols active - System will auto-resume in 15 seconds');
            
            // Set all signals to red
            Object.keys(signalStates).forEach(signalId => {
                signalStates[signalId] = 'red';
            });
            updateSignalDisplay();
            
            // Stop all trains regardless of priority
            document.querySelectorAll('.train').forEach(train => {
                train.classList.add('stopped');
            });
            
            trainDatabase.forEach(train => {
                train.status = 'stopped';
            });
            
            if (optimizationActive) {
                optimizationActive = false;
                stopTrainMovement();
                document.getElementById('optimizeBtn').textContent = 'Start Traffic Control';
                document.getElementById('optimizationIndicator').classList.add('idle');
                document.getElementById('optimizationText').textContent = 'Priority Control: Emergency Stop';
            }
            
            showNotification('EMERGENCY PROTOCOL ACTIVE - All trains stopped', 'error');
            
            setTimeout(() => {
                logToConsole('Emergency protocol deactivated');
                logToConsole('Resuming normal priority operations');
                
                addAIDecision('Emergency cleared - Resuming normal operations');
                addDelayPrediction('System recovery complete - Normal scheduling resumed');
                addAIRecommendation('All systems operational - Traffic control ready to restart');
                
                document.querySelectorAll('.train').forEach(train => {
                    train.classList.remove('stopped');
                });
                
                trainDatabase.forEach(train => {
                    train.status = 'ontime';
                });
                
                document.getElementById('optimizationText').textContent = 'Priority Control: Idle';
                showNotification('Emergency cleared - Normal operations resumed');
                
                initializeSignals();
            }, 15000);
        }

        function fetchLiveData() {
            if (!systemConnected) {
                showNotification('Connect system first', 'error');
                return;
            }
            
            const btn = document.getElementById('dataBtn');
            btn.disabled = true;
            btn.textContent = 'Refreshing...';
            
            logToConsole('Refreshing signal states...');
            logToConsole('Synchronizing with traffic control center...');
            addAIDecision('Data refresh initiated - Synchronizing with central control');
            
            setTimeout(() => {
                // Randomly update train statuses
                trainDatabase.forEach(train => {
                    if (Math.random() < 0.3) {
                        const statuses = ['ontime', 'delayed'];
                        train.status = statuses[Math.floor(Math.random() * statuses.length)];
                    }
                });
                
                // Reset signal states
                initializeSignals();
                updateScheduleDisplay();
                updateDetailedMetrics();
                
                addAIDecision('Live data refresh completed - All systems synchronized');
                addDelayPrediction('Updated traffic analysis: Network operating at optimal capacity');
                addAIRecommendation('Fresh data integration complete - Enhanced prediction accuracy');
                
                btn.disabled = false;
                btn.textContent = 'Refresh Signals';
                
                logToConsole('Signal refresh completed');
                showNotification('Signals and data refreshed successfully');
            }, 2000);
        }

        function logToConsole(message) {
            const console = document.getElementById('consoleOutput');
            const timestamp = new Date().toLocaleTimeString('en-IN');
            console.innerHTML += `[${timestamp}] ${message}<br>`;
            console.scrollTop = console.scrollHeight;
            
            const lines = console.innerHTML.split('<br>');
            if (lines.length > 20) {
                console.innerHTML = lines.slice(-20).join('<br>');
            }
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', init);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'c': e.preventDefault(); connectSystem(); break;
                    case 'o': e.preventDefault(); startOptimization(); break;
                    case 'e': e.preventDefault(); emergencyProtocol(); break;
                    case 'r': e.preventDefault(); fetchLiveData(); break;
                    case 'm': e.preventDefault(); toggleMode(); break;
                }
            }
        });
    
