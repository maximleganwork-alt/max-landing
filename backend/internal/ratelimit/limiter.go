package ratelimit

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type Limiter struct {
	mu       sync.Mutex
	visitors map[string]*entry
	rps      rate.Limit
	burst    int
	ttl      time.Duration
}

type entry struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

func New(perMinute int) *Limiter {
	if perMinute < 1 {
		perMinute = 5
	}
	rps := rate.Limit(float64(perMinute) / 60.0)
	l := &Limiter{
		visitors: make(map[string]*entry),
		rps:      rps,
		burst:    perMinute,
		ttl:      10 * time.Minute,
	}
	go l.cleanup()
	return l
}

func (l *Limiter) Allow(key string) bool {
	l.mu.Lock()
	v, ok := l.visitors[key]
	if !ok {
		v = &entry{limiter: rate.NewLimiter(l.rps, l.burst)}
		l.visitors[key] = v
	}
	v.lastSeen = time.Now()
	l.mu.Unlock()
	return v.limiter.Allow()
}

func (l *Limiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		now := time.Now()
		l.mu.Lock()
		for k, v := range l.visitors {
			if now.Sub(v.lastSeen) > l.ttl {
				delete(l.visitors, k)
			}
		}
		l.mu.Unlock()
	}
}
