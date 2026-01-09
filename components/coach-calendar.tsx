"use client"

import { useState, useEffect } from "react"

interface Lesson {
  id: string
  date: string
  startTime: string
  endTime: string
  type: "INDIVIDUAL" | "GROUP"
  studentNames: string[]
  isRecurring: boolean
  recurringEndDate: string | null
  notes: string | null
}

interface CoachCalendarProps {
  userId: string
}

export function CoachCalendar({ userId }: CoachCalendarProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "INDIVIDUAL" as "INDIVIDUAL" | "GROUP",
    studentNames: [""],
    isRecurring: false,
    recurringEndDate: "",
    notes: "",
  })
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchLessons()
  }, [currentWeek])

  const fetchLessons = async () => {
    try {
      const weekStart = getWeekStart(currentWeek)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      const response = await fetch(
        `/api/lessons?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`,
        { cache: 'no-store' }
      )
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    return new Date(d.setDate(diff))
  }

  const getWeekDays = () => {
    const weekStart = getWeekStart(currentWeek)
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getHours = () => {
    const hours = []
    for (let i = 8; i <= 22; i++) {
      hours.push(i)
    }
    return hours
  }

  const getLessonsForDateAndHour = (date: Date, hour: number) => {
    try {
      const dateStr = date.toISOString().split('T')[0]
      return lessons.filter(lesson => {
        try {
          const lessonDate = new Date(lesson.date)
          if (isNaN(lessonDate.getTime())) return false
          const lessonDateStr = lessonDate.toISOString().split('T')[0]
          if (lessonDateStr !== dateStr) return false
          
          const [startH, startM] = lesson.startTime.split(':').map(Number)
          const [endH, endM] = lesson.endTime.split(':').map(Number)
          const startTotal = startH * 60 + startM
          const endTotal = endH * 60 + endM
          const hourStart = hour * 60
          const hourEnd = (hour + 1) * 60
          
          // Check if lesson overlaps with this hour
          return startTotal < hourEnd && endTotal > hourStart
        } catch (e) {
          return false
        }
      })
    } catch (e) {
      return []
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    // Set time to noon to avoid timezone issues
    const dateWithTime = new Date(date)
    dateWithTime.setHours(12, 0, 0, 0)
    setFormData({
      ...formData,
      date: dateWithTime.toISOString(),
    })
    setShowForm(true)
    setEditingLesson(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.startTime || !formData.endTime) {
      setError("Başlangıç ve bitiş saati gereklidir")
      return
    }

    if (formData.studentNames.filter(n => n.trim()).length === 0) {
      setError("En az bir öğrenci ismi gereklidir")
      return
    }

    try {
      const url = editingLesson ? `/api/lessons/${editingLesson.id}` : "/api/lessons"
      const method = editingLesson ? "PUT" : "POST"

      let recurringEndDateValue = null
      if (formData.isRecurring && formData.recurringEndDate && formData.recurringEndDate.trim()) {
        try {
          const date = new Date(formData.recurringEndDate)
          if (!isNaN(date.getTime())) {
            recurringEndDateValue = date.toISOString()
          }
        } catch (e) {
          console.error("Invalid recurring end date:", e)
        }
      }

      const requestBody = {
        date: formData.date || new Date().toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type,
        studentNames: formData.studentNames.filter(n => n.trim()),
        isRecurring: formData.isRecurring,
        recurringEndDate: recurringEndDateValue,
        notes: formData.notes || null,
      }

      console.log("Sending lesson data:", requestBody)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({
          date: "",
          startTime: "",
          endTime: "",
          type: "INDIVIDUAL",
          studentNames: [""],
          isRecurring: false,
          recurringEndDate: "",
          notes: "",
        })
        setEditingLesson(null)
        fetchLessons()
      } else {
        const data = await response.json()
        console.error("Error response:", data)
        setError(data.error || data.details?.[0]?.message || "Ders kaydedilirken bir hata oluştu")
      }
    } catch (error) {
      setError("Ders kaydedilirken bir hata oluştu")
    }
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Bu dersi silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchLessons()
      }
    } catch (error) {
      alert("Ders silinirken bir hata oluştu")
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    
    let lessonDate = new Date().toISOString()
    try {
      const date = new Date(lesson.date)
      if (!isNaN(date.getTime())) {
        lessonDate = date.toISOString()
      }
    } catch (e) {
      console.error("Invalid lesson date:", e)
    }

    let recurringEndDateValue = ""
    if (lesson.recurringEndDate) {
      try {
        const date = new Date(lesson.recurringEndDate)
        if (!isNaN(date.getTime())) {
          date.setHours(12, 0, 0, 0)
          recurringEndDateValue = date.toISOString()
        }
      } catch (e) {
        console.error("Invalid recurring end date:", e)
      }
    }

    setFormData({
      date: lessonDate,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      type: lesson.type,
      studentNames: lesson.studentNames.length > 0 ? lesson.studentNames : [""],
      isRecurring: lesson.isRecurring,
      recurringEndDate: recurringEndDateValue,
      notes: lesson.notes || "",
    })
    setShowForm(true)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7)
      } else {
        newDate.setDate(prev.getDate() + 7)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const addStudentField = () => {
    setFormData({
      ...formData,
      studentNames: [...formData.studentNames, ""],
    })
  }

  const removeStudentField = (index: number) => {
    setFormData({
      ...formData,
      studentNames: formData.studentNames.filter((_, i) => i !== index),
    })
  }

  const updateStudentName = (index: number, value: string) => {
    const newNames = [...formData.studentNames]
    newNames[index] = value
    setFormData({ ...formData, studentNames: newNames })
  }

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ]

  const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
  const dayNamesShort = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>
  }

  const weekDays = getWeekDays()
  const hours = getHours()
  const weekStart = getWeekStart(currentWeek)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateWeek('prev')}
          className="rounded-lg border border-[#0b0b0b]/10 bg-white px-4 py-2 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#f7f4ec]"
        >
          ← Önceki Hafta
        </button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#0b0b0b]">
            {weekStart.getDate()} {monthNames[weekStart.getMonth()]} - {weekEnd.getDate()} {monthNames[weekEnd.getMonth()]} {weekEnd.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            className="text-sm text-gold-600 hover:text-gold-700 font-medium mt-1"
          >
            Bugüne Git
          </button>
        </div>
        <button
          onClick={() => navigateWeek('next')}
          className="rounded-lg border border-[#0b0b0b]/10 bg-white px-4 py-2 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#f7f4ec]"
        >
          Sonraki Hafta →
        </button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="rounded-2xl border border-[#0b0b0b]/6 bg-white p-4 shadow-lg shadow-black/10 overflow-auto max-h-[calc(100vh-300px)]">
        <div className="min-w-[900px]">
          {/* Day Headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2 mb-2">
            <div className="text-xs font-semibold text-gold-700 py-2 sticky left-0 bg-white z-10 text-center">
              Saat
            </div>
            {weekDays.map((day, idx) => {
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div
                  key={idx}
                  className={`text-center text-sm font-semibold py-2 ${
                    isToday ? 'text-gold-700 bg-gold-50 rounded-lg' : 'text-[#0b0b0b]'
                  }`}
                >
                  <div>{dayNamesShort[idx]}</div>
                  <div className={`text-xs ${isToday ? 'font-bold' : 'font-normal'}`}>
                    {day.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Hour Rows */}
          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-2">
                {/* Hour Label */}
                <div className="text-xs font-medium text-[#4a4a4a] py-1.5 sticky left-0 bg-white z-10 border-r border-[#0b0b0b]/5 text-center">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                
                {/* Day Cells */}
                {weekDays.map((day, dayIdx) => {
                  const dayLessons = getLessonsForDateAndHour(day, hour)
                  const isToday = day.toDateString() === new Date().toDateString()
                  
                  return (
                    <div
                      key={dayIdx}
                      onClick={() => {
                        const clickedDate = new Date(day)
                        clickedDate.setHours(hour, 0, 0, 0)
                        handleDateClick(clickedDate)
                      }}
                      className={`
                        min-h-[50px] p-1 rounded border cursor-pointer transition relative
                        ${isToday ? 'border-gold-400 bg-gold-50/30' : 'border-[#0b0b0b]/5 bg-white'}
                        hover:border-gold-400 hover:bg-gold-50/50
                        group
                      `}
                    >
                      {dayLessons.map(lesson => {
                        const [startH, startM] = lesson.startTime.split(':').map(Number)
                        const [endH, endM] = lesson.endTime.split(':').map(Number)
                        const isFirstHour = hour === startH
                        
                        // Only show lesson in the hour it starts
                        if (!isFirstHour) return null
                        
                        // Calculate position and height
                        const startTotal = startH * 60 + startM
                        const endTotal = endH * 60 + endM
                        const duration = endTotal - startTotal
                        const topPercent = (startM / 60) * 100
                        const heightPercent = (duration / 60) * 100
                        const rowHeight = 50 // min-h-[50px] = 50px
                        const actualHeight = Math.max((duration / 60) * rowHeight, 35)
                        
                        return (
                          <div
                            key={lesson.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(lesson)
                            }}
                            className={`
                              absolute left-1 right-1 rounded-lg px-2 py-1.5 text-xs font-medium shadow-sm
                              cursor-pointer z-20 transition hover:shadow-md hover:scale-[1.02]
                              ${lesson.type === 'INDIVIDUAL' 
                                ? 'bg-blue-500 text-white border border-blue-600' 
                                : 'bg-purple-500 text-white border border-purple-600'
                              }
                            `}
                            style={{
                              top: `${topPercent}%`,
                              height: `${actualHeight}px`,
                              minHeight: '40px',
                            }}
                            title={`${lesson.startTime} - ${lesson.endTime}\nÖğrenciler: ${lesson.studentNames.join(', ')}\nTip: ${lesson.type === 'INDIVIDUAL' ? 'Bireysel' : 'Grup'}${lesson.notes ? `\nNot: ${lesson.notes}` : ''}`}
                          >
                            <div className="font-bold text-[11px] mb-0.5">
                              {lesson.startTime} - {lesson.endTime}
                            </div>
                            <div className="truncate text-[10px] opacity-95 font-medium">
                              {lesson.studentNames.slice(0, 2).join(', ')}
                              {lesson.studentNames.length > 2 && ` +${lesson.studentNames.length - 2}`}
                            </div>
                            <div className="text-[9px] opacity-80 mt-0.5">
                              {lesson.type === 'INDIVIDUAL' ? 'Bireysel' : 'Grup Dersi'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Lesson Button */}
      <button
        onClick={() => {
          setShowForm(true)
          setEditingLesson(null)
          const today = new Date()
          today.setHours(12, 0, 0, 0)
          setFormData({
            date: today.toISOString(),
            startTime: "",
            endTime: "",
            type: "INDIVIDUAL",
            studentNames: [""],
            isRecurring: false,
            recurringEndDate: "",
            notes: "",
          })
        }}
        className="w-full rounded-lg bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40"
      >
        + Yeni Ders Ekle
      </button>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#0b0b0b]">
                  {editingLesson ? "Dersi Düzenle" : "Yeni Ders Ekle"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingLesson(null)
                    setError("")
                  }}
                  className="text-[#4a4a4a] hover:text-[#0b0b0b]"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          const date = new Date(e.target.value)
                          date.setHours(12, 0, 0, 0)
                          setFormData({ ...formData, date: date.toISOString() })
                        }
                      }}
                      required
                      className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                      Ders Tipi *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "INDIVIDUAL" | "GROUP" })}
                      required
                      className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                    >
                      <option value="INDIVIDUAL">Bireysel Ders</option>
                      <option value="GROUP">Grup Dersi</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                      Başlangıç Saati *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                      Bitiş Saati *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                    Öğrenci İsimleri *
                  </label>
                  {formData.studentNames.map((name, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateStudentName(index, e.target.value)}
                        placeholder="Öğrenci adı"
                        className="flex-1 rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                      />
                      {formData.studentNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStudentField(index)}
                          className="rounded-xl border border-red-400/50 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStudentField}
                    className="text-sm text-gold-600 font-medium hover:text-gold-700"
                  >
                    + Öğrenci Ekle
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="rounded border-[#0b0b0b]/10"
                    />
                    <span className="text-sm font-medium text-[#0b0b0b]">
                      Haftalık tekrar eden ders
                    </span>
                  </label>
                  {formData.isRecurring && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                        Tekrar Bitiş Tarihi *
                      </label>
                      <input
                        type="date"
                        value={formData.recurringEndDate ? new Date(formData.recurringEndDate).toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            const date = new Date(e.target.value)
                            date.setHours(12, 0, 0, 0)
                            setFormData({ ...formData, recurringEndDate: date.toISOString() })
                          } else {
                            setFormData({ ...formData, recurringEndDate: "" })
                          }
                        }}
                        required={formData.isRecurring}
                        className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0b0b0b] mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-[#0b0b0b]/10 bg-[#f7f4ec] px-4 py-3 text-sm text-[#0b0b0b] focus:border-gold-400 focus:outline-none"
                    placeholder="Ders hakkında notlar..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-gold-500/30 transition hover:-translate-y-0.5 hover:shadow-gold-400/40"
                  >
                    {editingLesson ? "Güncelle" : "Kaydet"}
                  </button>
                  {editingLesson && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingLesson.id)}
                      className="rounded-lg border border-red-400/50 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Sil
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingLesson(null)
                      setError("")
                    }}
                    className="rounded-lg border border-[#0b0b0b]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#f7f4ec]"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
