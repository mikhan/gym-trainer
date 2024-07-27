export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      exercise: {
        Row: {
          altName: string
          createdAt: string
          equipment: string
          id: number
          imageId: string | null
          level: number
          muscleId: number
          name: string
          type: string
        }
        Insert: {
          altName: string
          createdAt?: string
          equipment: string
          id?: number
          imageId?: string | null
          level: number
          muscleId: number
          name: string
          type: string
        }
        Update: {
          altName?: string
          createdAt?: string
          equipment?: string
          id?: number
          imageId?: string | null
          level?: number
          muscleId?: number
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exercise_muscleId_fkey'
            columns: ['muscleId']
            isOneToOne: false
            referencedRelation: 'muscle'
            referencedColumns: ['id']
          },
        ]
      }
      muscle: {
        Row: {
          createdAt: string
          id: number
          name: string
        }
        Insert: {
          createdAt?: string
          id?: number
          name: string
        }
        Update: {
          createdAt?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      routine: {
        Row: {
          created_at: string
          id: string
          name: string
          trainingId: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          trainingId: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          trainingId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'routine_trainingId_fkey'
            columns: ['trainingId']
            isOneToOne: false
            referencedRelation: 'training'
            referencedColumns: ['id']
          },
        ]
      }
      routine_set: {
        Row: {
          created_at: string
          id: string
          name: string
          routineId: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          routineId: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          routineId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'routine_set_routineId_fkey'
            columns: ['routineId']
            isOneToOne: false
            referencedRelation: 'routine'
            referencedColumns: ['id']
          },
        ]
      }
      training: {
        Row: {
          createdAt: string
          id: string
          name: string
          routines: Json | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          routines?: Json | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          routines?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
